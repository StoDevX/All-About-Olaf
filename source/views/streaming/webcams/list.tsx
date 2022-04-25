import * as React from 'react'
import {StyleSheet, ScrollView, useWindowDimensions} from 'react-native'
import {TabBarIcon} from '@frogpond/navigation-tabs'
import {Column} from '@frogpond/layout'
import {partitionByIndex} from '../../../lib/partition-by-index'
import type {Webcam} from './types'
import {StreamThumbnail} from './thumbnail'
import {API} from '@frogpond/api'
import {fetch} from '@frogpond/fetch'
import {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs'

const fetchWebcams = (): Promise<Array<Webcam>> =>
	fetch(API('/webcams'))
		.json<{data: Array<Webcam>}>()
		.then((body) => body.data)

export let WebcamsView = (): JSX.Element => {
	let [webcams, setWebcams] = React.useState<Webcam[]>([])

	let viewport = useWindowDimensions()

	// TODO: This will be inlined into a new streaming index
	// that calls createBottomTabNavigator. Leaving it typed
	// but unused until streaming is plugged-in to the navigator.
	//
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let navigationOptions: BottomTabNavigationOptions = {
		tabBarLabel: 'Webcams',
		tabBarIcon: TabBarIcon('videocam'),
	}

	React.useEffect(() => {
		let fetchData = async () => {
			let webcams = await fetchWebcams()
			setWebcams(webcams)
		}

		fetchData()
	}, [])

	let columns = partitionByIndex(webcams)

	return (
		<ScrollView contentContainerStyle={styles.container}>
			{columns.map((contents, i) => (
				<Column key={i} style={styles.column}>
					{contents.map((webcam) => (
						<StreamThumbnail
							key={webcam.name}
							viewportWidth={viewport.width}
							webcam={webcam}
						/>
					))}
				</Column>
			))}
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 5,
		flexDirection: 'row',
	},
	column: {
		flex: 1,
		alignItems: 'center',
	},
})
