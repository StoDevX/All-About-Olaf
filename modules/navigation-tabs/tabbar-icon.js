// @flow
import * as React from 'react'
import {StyleSheet, Platform} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const styles = StyleSheet.create({
	icon: {
		fontSize: Platform.select({
			ios: 30,
			android: 24,
		}),
	},
})

type Props = {
	tintColor: string,
	focused: boolean,
}

export const platformPrefixIcon = (name: string) => {
	let isAvailable = Icon.hasIcon(name)
	let isAvailableOnBothPlatforms =
		Icon.hasIcon(`ios-${name}`) && Icon.hasIcon(`md-${name}`)

	if (isAvailable && !isAvailableOnBothPlatforms) {
		return name
	}

	return Platform.OS === 'ios' ? `ios-${name}` : `md-${name}`
}

export const TabBarIcon = (icon: string) => ({tintColor}: Props) => (
	<Icon
		name={platformPrefixIcon(icon)}
		style={[styles.icon, {color: tintColor}]}
	/>
)
