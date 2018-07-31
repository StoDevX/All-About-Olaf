/* eslint-disable camelcase */
// @flow

import * as React from 'react'
import {TabNavigator} from '../components/tabbed-view'
import {TabBarIcon} from '../components/tabbar-icon'

import * as newsImages from '../../../images/news-sources'
import {NewsList} from './news-list'

const NewsView = TabNavigator({
	StOlafNewsView: {
		screen: ({navigation}) => (
			<NewsList
				mode="wp-json"
				name="St. Olaf"
				navigation={navigation}
				query={{per_page: 10, _embed: true}}
				thumbnail={newsImages.stolaf}
				url="https://wp.stolaf.edu/wp-json/wp/v2/posts"
			/>
		),
		navigationOptions: {
			tabBarLabel: 'St. Olaf',
			tabBarIcon: TabBarIcon('school'),
		},
	},

	OlevilleNewsView: {
		screen: ({navigation}) => (
			<NewsList
				mode="wp-json"
				name="Oleville"
				navigation={navigation}
				query={{per_page: 10, _embed: true}}
				thumbnail={newsImages.oleville}
				url="https://oleville.com/wp-json/wp/v2/posts/"
			/>
		),
		navigationOptions: {
			tabBarLabel: 'Oleville',
			tabBarIcon: TabBarIcon('happy'),
		},
	},

	MessNewsView: {
		screen: ({navigation}) => (
			<NewsList
				mode="wp-json"
				name="The Mess"
				navigation={navigation}
				query={{per_page: 10, _embed: true}}
				thumbnail={newsImages.mess}
				url="https://www.manitoumessenger.com/wp-json/wp/v2/posts/"
			/>
		),
		navigationOptions: {
			tabBarLabel: 'The Mess',
			tabBarIcon: TabBarIcon('paper'),
		},
	},

	PoliticOleNewsView: {
		screen: ({navigation}) => (
			<NewsList
				mode="rss"
				name="PoliticOle"
				navigation={navigation}
				thumbnail={newsImages.politicole}
				url="https://oleville.com/politicole/feed/"
			/>
		),
		navigationOptions: {
			tabBarLabel: 'PoliticOle',
			tabBarIcon: TabBarIcon('megaphone'),
		},
	},

	KstoNewsView: {
		screen: ({navigation}) => (
			<NewsList
				mode="wp-json"
				name="KSTO"
				navigation={navigation}
				query={{per_page: 10, _embed: true}}
				thumbnail={newsImages.ksto}
				url="https://pages.stolaf.edu/ksto/wp-json/wp/v2/posts/"
			/>
		),
		navigationOptions: {
			tabBarLabel: 'KSTO',
			tabBarIcon: TabBarIcon('radio'),
		},
	},
})
NewsView.navigationOptions = {
	title: 'News',
}

export default NewsView
