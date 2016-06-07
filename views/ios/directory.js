/**
 * All About Olaf
 * iOS Directory page
 */
'use strict'

// React native
const React = require('react')
const {Component} = React
var RN = require('react-native')
// Namespacing

// XML Parsing
var XMLParse = require('xml-parser')

// Data url
// Note: this is temporary while testing. Need to:
// 1. Load directory url from existing parse database
// 2. Append search parameters (firstname, lastname, email)
// 3. Make it display the data. We have the data, now render it (see data in Xcode debug)
//    I am having a tough time using the data outside of the XMLHttpRequest...
// 4. Add search bar and tableview/listview for rendering
var REQUEST_URL = 'http://www.stolaf.edu/personal/directory/index.cfm?fuseaction=SearchResults&lastname=smith&format=xml'

// Namespacing
var {
  ListView,
  Navigator,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = RN

// Device info
var Dimensions = require('Dimensions')
// Screen size information
let Viewport = Dimensions.get('window')
let height = Viewport.height / 7
let margin = Viewport.width / 13
let marginTop = 64
let width = Viewport.width / 2.3


  // Initial state
  function getInitialState() {
    return {
      null,
    }
  }

/******************************************
 *
 *         DirectoryPage Class
 *
 *****************************************/

class DirectoryPage extends Component {
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
 *       Pushing a new view
 *
 *****************************************/

  // Go to request page
  pushView(view, viewTitle) {
    this.props.navigator.push({
      id: view,
      title: viewTitle,
      sceneConfig: Navigator.SceneConfigs.FloatFromRight,
    })
  }


/******************************************
 *
 *              Rendering
 *
 *****************************************/

  // Render a given scene
  renderScene(route, navigator) {

    // Get data via an XMLHttpRequest
    var request = new XMLHttpRequest()
        request.onreadystatechange = (e) => {

      if (request.readyState !== 4) {
        return
      }

      if (request.status === 200 && request.readyState === 4) {
        // Success
        var requestResponse = request.responseText
        // Parse into a readable format
        var parsedXML = XMLParse(requestResponse)
        // The meat of it...
        var people = parsedXML['root']['children']
        // Convert to JSON
        var jsonPeople = JSON.stringify(people)
        // Parse the JSON
        var jsonPeopleParsed = JSON.parse(jsonPeople)

        // Array to hold all people and their desired attributes
        var peopleArray = []
        // Loop through each object and save what we want
        for (var i = 0; i < Object.keys(jsonPeopleParsed).length; ++i) {
            // Individual and properties
            var person = []
            // Find the properties we want
            if("Building" == jsonPeopleParsed[i]['children'][0]['name']) {
                person.building = jsonPeopleParsed[i]['children'][0]['content']
            }
            if("ClassYear" == jsonPeopleParsed[i]['children'][1]['name']) {
                person.classyear = jsonPeopleParsed[i]['children'][1]['content']
            }
            if("Email" == jsonPeopleParsed[i]['children'][2]['name']) {
                person.email = jsonPeopleParsed[i]['children'][2]['content']
            }
            if("Exten" == jsonPeopleParsed[i]['children'][3]['name']) {
                person.exten = jsonPeopleParsed[i]['children'][3]['content']
            }
            if("FirstName" == jsonPeopleParsed[i]['children'][4]['name']) {
                person.firstname = jsonPeopleParsed[i]['children'][4]['content']
            }
            if("LastName" == jsonPeopleParsed[i]['children'][5]['name']) {
                person.lastname = jsonPeopleParsed[i]['children'][5]['content']
            }
            if("Room" == jsonPeopleParsed[i]['children'][6]['name']) {
                person.room = jsonPeopleParsed[i]['children'][6]['content']
            }
            // Add the individual to the array of people
            peopleArray.push(person)
        }

        returnTheData(peopleArray)
      }
      else {
        // Failure
        console.warn('error')
      }
    }

    request.open('GET', REQUEST_URL)
    request.send()

    function returnTheData(data) {
        console.log(data)

     // Note: This is not working. Figure out how XMLHttpRequests callbacks work...
     return (
        <View>
            <Text>
            {data}
            </Text>
        </View>
     )
    }
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
          Directory
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
    paddingLeft: 17,
    marginLeft: margin - 25,
    marginTop: marginTop,
    flexDirection:'row',
    flexWrap:'wrap',
  },

  // Directory list
  directoryList: {
    marginTop: marginTop + 10,
    marginLeft: margin,
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

module.exports = DirectoryPage
