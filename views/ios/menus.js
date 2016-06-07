/**
 * All About Olaf
 * iOS Menus page
 */
'use strict'

// React native
const React = require('react')
const {Component} = React
const RN = require('react-native')
// Namespacing
const {
  Navigator,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  WebView,
} = RN

// Device info
const Dimensions = require('Dimensions')
// Screen size information
let Viewport = Dimensions.get('window')
let marginTop = 60

// URL info
const TEXT_INPUT_REF = 'urlInput';
const WEBVIEW_REF = 'webview';

// Note: Fix me.
// 1. Don't keep this here... make a general purpose webview and pass url in from the router.
// 2. Also, pull this string in from existing Parse database to ensure up-to-date info.
// 3. A bunch of leftover history forwards/backwards/text input ref/webview ref things
//    exist but are not used. Maybe redo the router so you can construct apps the "react way"
const DEFAULT_URL = 'http://stolaf.cafebonappetit.com/cafe/stav-hall/#Lunch';

let url = DEFAULT_URL
let status = 'No Page Loaded'
let backButtonEnabled = false
let forwardButtonEnabled = false
let loading = true
let scalesPageToFit = true
let inputText = ''


/******************************************
 *
 *           MenusPage Class
 *
 *****************************************/

class MenusPage extends Component {
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator}
          navigationBar={
            <Navigator.NavigationBar
                style={styles.navigationBar}
                routeMapper={NavigationBarRouteMapper} />
          } />
    )
  }

/******************************************
 *
 *              Rendering
 *
 *****************************************/

  // Render a given scene
  renderScene(route, navigator) {
        this.inputText = TEXT_INPUT_REF;
        return (
          <View style={[styles.container]}>
            <WebView
              ref={WEBVIEW_REF}
              automaticallyAdjustContentInsets={false}
              style={styles.webView}
              url={url}
              javaScriptEnabledAndroid={true}
              onNavigationStateChange={this.onNavigationStateChange}
              onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
              startInLoadingState={true}
              scalesPageToFit={scalesPageToFit}/>
          </View>
        )
  }

/******************************************
 *
 * Functions for buttons that do not work or display
 *
 *****************************************/

   handleTextInputChange(event) {
    this.inputText = event.nativeEvent.text
  }

  goBack() {
    this.refs[WEBVIEW_REF].goBack()
  }

  goForward() {
    this.refs[WEBVIEW_REF].goForward()
  }

  reload() {
    this.refs[WEBVIEW_REF].reload()
  }

  onShouldStartLoadWithRequest(event) {
    return true
  }

  onNavigationStateChange(navState) {
    backButtonEnabled = navState.canGoBack
    forwardButtonEnabled = navState.canGoForward
    url = navState.url
    status = navState.title
    loading = navState.loading
    scalesPageToFit = true
  }

  onSubmitEditing(event) {
    this.pressGoButton()
  }

}

/******************************************
 *
 *              Routing
 *
 *****************************************/

var NavigationBarRouteMapper = {
  // Left button customization
  LeftButton(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={styles.navButton}
          onPress={() => navigator.parentNavigator.pop()}>
        <Text style={styles.navigationButtonText}>
            Back
        </Text>
      </TouchableOpacity>
    )
  },
  // Right button customization
  RightButton(route, navigator, index, navState) {
    return null
  },
  // Title customization
  Title(route, navigator, index, navState) {
    return (
        <Text style={styles.navigationText}>
          Menus
        </Text>
    )
  }
}

/******************************************
 *
 *              Styles
 *
 *****************************************/

var styles = StyleSheet.create({
  // Body container
  container: {
    flex: 1,
    marginTop: marginTop,
    flexDirection:'row',
    flexWrap:'wrap',
  },

  // Navigation bar styling
  navigationBar: {
    backgroundColor: "orange",
  },
  navigationButton: {
    flex: 1,
    justifyContent: 'center',
  },
  navigationButtonText: {
    color: 'white',
    margin: 10,
  },
  navigationText: {
    color: 'white',
    margin: 10,
    fontSize: 16,
  },

})

module.exports = MenusPage
