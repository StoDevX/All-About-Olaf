// @flow
/**
 * All About Olaf
 * iOS Home page
 */

import React from 'react'
import {
  Navigator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  View,
  Platform,
  AsyncStorage,
  TouchableNativeFeedback,
} from 'react-native'

import Icon from 'react-native-vector-icons/Entypo'
import * as c from './components/colors'
import sortBy from 'lodash/sortBy'
import type {TopLevelViewPropsType} from './types'
//import AsyncStorageHOC from './components/asyncStorageHOC'

const Dimensions = require('Dimensions')
let Viewport = Dimensions.get('window')

type ViewType = {view: string, title: string, icon: string, tint: string};

export const views: ViewType[] = [
  {view: 'MenusView', title: 'Menus', icon: 'bowl', tint: c.emerald},
  {view: 'SISView', title: 'SIS', icon: 'fingerprint', tint: c.goldenrod},
  {view: 'BuildingHoursView', title: 'Building Hours', icon: 'clock', tint: c.wave},
  {view: 'CalendarView', title: 'Calendar', icon: 'calendar', tint: c.coolPurple},
  {view: 'DirectoryView', title: 'Directory', icon: 'v-card', tint: c.indianRed},
  {view: 'StreamingView', title: 'Streaming Media', icon: 'video', tint: c.denim},
  {view: 'NewsView', title: 'News', icon: 'news', tint: c.eggplant},
  {view: 'MapView', title: 'Campus Map', icon: 'map', tint: c.coffee},
  {view: 'ContactsView', title: 'Important Contacts', icon: 'phone', tint: c.crimson},
  {view: 'TransportationView', title: 'Transportation', icon: 'address', tint: c.cardTable},
  {view: 'DictionaryView', title: 'Campus Dictionary', icon: 'open-book', tint: c.olive},
  {view: 'OlevilleView', title: 'Oleville', icon: 'mouse-pointer', tint: c.grapefruit},
]

const HomeScreenTouchable = ({...props, children}: {props: any, children: React$Element}) => {
  return Platform.OS === 'ios'
    ? <TouchableOpacity {...props} activeOpacity={0.65}>{children}</TouchableOpacity>
    : <TouchableNativeFeedback {...props} background={TouchableNativeFeedback.SelectableBackground}>{children}</TouchableNativeFeedback>
}

function HomeScreenButton({view, onPress}: {view: ViewType, onPress: () => any}) {
  return (
    <HomeScreenTouchable onPress={onPress}>
      <View style={[styles.rectangle, {backgroundColor: view.tint}]}>
        <Icon name={view.icon} size={32} style={styles.rectangleButtonIcon} />
        <Text style={styles.rectangleButtonText}>
          {view.title}
        </Text>
      </View>
    </HomeScreenTouchable>
  )
}

function HomePage({navigator, route, order, views}: {order: string[], views: ViewType[]} & TopLevelViewPropsType) {
  const sortedViews = sortBy(views, view => order.indexOf(view.view))

  return (
    <ScrollView
      overflow='hidden'
      alwaysBounceHorizontal={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={styles.scrollView}
      contentContainerStyle={styles.cells}
    >
      <StatusBar barStyle='light-content' backgroundColor={c.gold} />

      {sortedViews.map(view =>
        <HomeScreenButton
          view={view}
          key={view.view}
          onPress={() => navigator.push({
            id: view.view,
            index: route.index + 1,
            title: view.title,
            sceneConfig: Navigator.SceneConfigs.PushFromRight,
          })}
        />)
      }
    </ScrollView>
  )
}

export default class HomePageScene extends React.Component {
  static propTypes = {
    navigator: React.PropTypes.instanceOf(Navigator),
    route: React.PropTypes.object,
  }

  state = {
    order: [],
  }

  componentWillMount() {
    this.loadData()
  }

  componentWillReceiveProps() {
    this.loadData()
  }

  loadData = async () => {
    let savedOrder = JSON.parse(await AsyncStorage.getItem('homescreen:view-order'))

    // check to see if we have a modified view order or not
    savedOrder = savedOrder || []

    this.setState({order: savedOrder})
  }

  render() {
    return (
      <HomePage
        route={this.props.route}
        navigator={this.props.navigator}
        order={this.state.order}
        views={views}
      />
    )
  }
}

HomePageScene.propTypes = {
  navigator: React.PropTypes.instanceOf(Navigator),
  route: React.PropTypes.object.isRequired,
}


let cellMargin = 10
let cellSidePadding = 10
let cellEdgePadding = 4
let cellWidth = (Viewport.width / 2) - (cellMargin * 1.5)

let styles = StyleSheet.create({
  // Body container
  cells: {
    marginHorizontal: cellMargin / 2,
    marginTop: cellMargin / 2,
    paddingBottom: cellMargin / 2,

    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  rows: {},

  scrollView: {
    // elevation: 2,
  },

  // Main buttons for actions on home screen
  rectangle: {
    width: cellWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: cellSidePadding,
    paddingBottom: cellSidePadding / 2,
    paddingHorizontal: cellEdgePadding,
    borderRadius: Platform.OS === 'ios' ? 6 : 3,
    elevation: 2,

    marginTop: cellMargin / 2,
    marginBottom: cellMargin / 2,
    marginLeft: cellMargin / 2,
    marginRight: cellMargin / 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(224, 224, 224)',
  },

  listIcon: {
    paddingLeft: 15,
    paddingRight: 30,
  },
  listText: {
    fontSize: 16,
  },

  // Text styling in buttons
  rectangleButtonIcon: {
    color: c.white,
  },
  rectangleButtonText: {
    color: c.white,
    marginTop: cellSidePadding / 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
    textAlign: 'center',
    fontSize: 14,
  },
})
