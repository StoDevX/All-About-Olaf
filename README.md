# AAO-React-Native

## About
The St. Olaf community, now in pocket size... rewritten in React Native.  This is a rewrite of [All About Olaf](http://drewvolz.com/all-about-olaf/) in React Native as it is currently written in Objective-C.

## Getting Started

- Clone the repository
- `cd` into the folder
- Install React Native: http://facebook.github.io/react-native/docs/getting-started.html#content
- `npm install`
- `npm run ios`

## Note
The Calendar might nag you for a Google Calendar API key. You can either ask someone involved with this project for a key, or you may [create one yourself](https://console.developers.google.com/projectselector/apis/credentials) for use during development.

1. Create the `keys.js` file in the uppermost directory of the project
2. Insert this string into the file below and add your key to it

    `export const calendarKey = your-key-here`

## Completed
* Stav Menu (minus auto-scroll to dinner menu)
* Directory
* Home Page
* Important Contacts (might add more contacts to the list)
* Campus Dictionary

## Work-In-Progress
* Cage Menu
* Calendar
* Building Hours
* Settings

## Todo (modules)
* Campus Map *PRs Welcome*
* News *PRs Welcome*
* Streaming Media *PRs Welcome*
* Transportation
* Oleville
* SIS *PRs Welcome*

## Todo (other)
* Push Notifications
* Analytics
* A better router
* [3D touch actions](https://github.com/jordanbyron/react-native-quick-actions) for icon and within
* [Touch-ID](https://github.com/naoufal/react-native-touch-id) for SIS

## Contributing
Would you like to contribute? Great! Have a look at [React Native](http://facebook.github.io/react-native/docs/getting-started.html) and have at it. Pull requests required, so fork away and make one! If you feel like you should have write access to the repo, make an issue and we can discuss it.
