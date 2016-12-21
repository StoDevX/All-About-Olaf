// @flow
import React from 'react'
import {View, Text} from 'react-native'
import LoadingView from '../components/loading'
import type {TopLevelViewPropsType} from '../types'
import {FancyMenu} from './components/fancy-menu'
import type {BonAppMenuInfoType, BonAppCafeInfoType} from './types'
import sample from 'lodash/sample'
import type momentT from 'moment'
import moment from 'moment-timezone'
const CENTRAL_TZ = 'America/Winnipeg'
import {findMenu} from './lib/find-menu'
import {fetchJson} from '../components/fetch'

const bonappMenuBaseUrl = 'http://legacy.cafebonappetit.com/api/2/menus'
const bonappCafeBaseUrl = 'http://legacy.cafebonappetit.com/api/2/cafes'

export class BonAppHostedMenu extends React.Component {
  state: {
    loading: boolean,
    now: momentT,
    cafeInfo: ?BonAppCafeInfoType,
    cafeMenu: ?BonAppMenuInfoType,
  } = {
    loading: true,
    now: moment.tz(CENTRAL_TZ),
    cafeMenu: null,
    cafeInfo: null,
  }

  componentWillMount() {
    this.fetchData()
  }

  props: TopLevelViewPropsType & {
    cafeId: string,
    loadingMessage: string[],
  }

  fetchData = async () => {
    this.setState({loading: true})

    let requests = await Promise.all([
      fetchJson(bonappMenuBaseUrl, {cafe: this.props.cafeId}),
      fetchJson(bonappCafeBaseUrl, {cafe: this.props.cafeId}),
    ])

    let [
      cafeMenu: BonAppMenuInfoType,
      cafeInfo: BonAppCafeInfoType,
    ] = requests

    this.setState({loading: false, cafeMenu, cafeInfo, now: moment.tz(CENTRAL_TZ)})
  }

  render() {
    if (this.state.loading) {
      let msg = sample(this.props.loadingMessage)
      return <LoadingView text={msg} />
    }

    if (!this.state.cafeMenu || !this.state.cafeInfo) {
      return (
        <View>
          <Text>Something went wrong. Email odt@stolaf.edu to let them know?</Text>
        </View>
      )
    }

    let {cafeId} = this.props
    let {
      now,
      cafeMenu,
      cafeInfo,
    } = this.state

    // We grab the "today" info from here because BonApp returns special
    // messages in this response, like "Closed for Christmas Break"
    let days = cafeInfo.cafes[cafeId].days
    let today = days.find(({date}) => date === now.format('YYYY-MM-DD'))
    if (!today || today.status === 'closed') {
      return <LoadingView text={today ? today.message : 'Closed today'} />
    }

    // We hard-code to the first day returned because we're only requesting one day.
    // `cafes` is a map of cafe ids to cafes, but we only request one at a time.
    let dayparts = cafeMenu.days[0].cafes[cafeId].dayparts
    let mealInfo = findMenu(dayparts, now)
    let mealName = mealInfo ? mealInfo.label : ''

    return (
      <FancyMenu
        route={this.props.route}
        navigator={this.props.navigator}
        now={now}
        menuLabel={mealName}
        menuCorIcons={cafeMenu.cor_icons}
        foodItems={cafeMenu.items}
      />
    )
  }
}
