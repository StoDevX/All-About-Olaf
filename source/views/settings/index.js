// @flow
import React from 'react'
import {StyleSheet, ScrollView, Platform} from 'react-native'
import {TableView} from 'react-native-tableview-simple'
import type {TopLevelViewPropsType} from '../types'
import {
  logInViaToken,
  logOutViaToken,
  setFeedbackStatus,
} from '../../flux/parts/settings'
import {connect} from 'react-redux'
import * as c from '../components/colors'

import CredentialsLoginSection from './sections/login-credentials'
import {TokenLoginSection} from './sections/login-token'
import {OddsAndEndsSection} from './sections/odds-and-ends'
import {SupportSection} from './sections/support'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Platform.OS === 'ios' ? c.iosLightBackground : c.androidLightBackground,
    paddingVertical: 20,
  },
})

type SettingsViewPropsType = TopLevelViewPropsType & {
  tokenValid: boolean,
  tokenMessage: string,

  logInViaToken: (status: boolean) => any,
  logOutViaToken: () => any,
  setFeedbackStatus: (feedbackDisabled: boolean) => any,
  feedbackDisabled: boolean,
};

function SettingsView(props: SettingsViewPropsType) {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps='always'
      keyboardDismissMode='on-drag'
    >
      <TableView>
        <CredentialsLoginSection />

        <TokenLoginSection
          navigator={props.navigator}
          route={props.route}
          loggedIn={props.tokenValid}
          logIn={props.logInViaToken}
          logOut={props.logOutViaToken}
          message={props.tokenMessage}
        />

        <SupportSection />

        <OddsAndEndsSection
          feedbackDisabled={props.feedbackDisabled}
          onChangeFeedbackToggle={props.setFeedbackStatus}
          navigator={props.navigator}
          route={props.route}
        />
      </TableView>
    </ScrollView>
  )
}

function mapStateToProps(state) {
  return {
    tokenValid: state.settings.token.valid,
    tokenMessage: state.settings.token.error,
    feedbackDisabled: state.settings.feedbackDisabled,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logInViaToken: s => dispatch(logInViaToken(s)),
    logOutViaToken: () => dispatch(logOutViaToken()),
    setFeedbackStatus: s => dispatch(setFeedbackStatus(s)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView)
