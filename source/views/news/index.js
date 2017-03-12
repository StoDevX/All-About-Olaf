/* eslint-disable camelcase */
/**
 * @flow
 * All About Olaf
 * News page
 */

import React from 'react'

import type {TopLevelViewPropsType} from '../types'
import {TabbedView, Tab} from '../components/tabbed-view'
import NewsContainer from './news-container'

export default function NewsPage({navigator, route}: TopLevelViewPropsType) {
  return (
    <TabbedView>
      <Tab
        id="StOlafNewsView"
        title="St. Olaf"
        icon="school"
        render={() => (
          <NewsContainer
            route={route}
            navigator={navigator}
            mode="wp-json"
            url="https://wp.stolaf.edu/wp-json/wp/v2/posts"
            query={{per_page: 10, _embed: true}}
            name="St. Olaf"
          />
        )}
      />

      <Tab
        id="OlevilleNewsView"
        title="Oleville"
        icon="happy"
        render={() => (
          <NewsContainer
            route={route}
            navigator={navigator}
            mode="wp-json"
            url="http://oleville.com/wp-json/wp/v2/posts/"
            query={{per_page: 10, _embed: true}}
            embedFeaturedImage={true}
            name="Oleville"
          />
        )}
      />

      <Tab
        id="TheMessNewsView"
        title="The Mess"
        icon="paper"
        render={() => (
          <NewsContainer
            route={route}
            navigator={navigator}
            mode="rss"
            url="http://manitoumessenger.com/feed/"
            name="The Mess"
          />
        )}
      />

      <Tab
        id="PoliticOleNewsView"
        title="PoliticOle"
        icon="megaphone"
        render={() => (
          <NewsContainer
            route={route}
            navigator={navigator}
            mode="rss"
            url="http://oleville.com/politicole/feed/"
            name="PoliticOle"
          />
        )}
      />

      <Tab
        id="KstoNewsView"
        title="KSTO"
        icon="radio"
        render={() => (
          <NewsContainer
            route={route}
            navigator={navigator}
            mode="wp-json"
            url="https://pages.stolaf.edu/ksto/wp-json/wp/v2/posts/"
            query={{per_page: 10, _embed: true}}
            name="KSTO"
          />
        )}
      />
    </TabbedView>
  )
}
