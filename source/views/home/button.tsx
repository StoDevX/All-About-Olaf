import * as React from 'react'
import {View, Text, StyleSheet, Platform, Image} from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import type {ViewType} from '../views'
import LinearGradient from 'react-native-linear-gradient'
import {Touchable} from '@frogpond/touchable'
import {transparent} from '@frogpond/colors'
import {homescreenForegroundDark, homescreenForegroundLight} from './colors'
import {hasNotch} from 'react-native-device-info'

type Props = {
	view: ViewType
	onPress: () => any
}

type HomeIconProps = {
	view: ViewType
	foreground: {color: string}
}

let HomeIcon = (props: HomeIconProps): JSX.Element => {
	let {view, foreground} = props

	switch (view.icon.type) {
		case 'icon':
			return (
				<Icon
					name={view.icon.name}
					size={32}
					style={[foreground, styles.icon]}
				/>
			)
		case 'image':
			return (
				<Image
					accessibilityIgnoresInvertColors={true}
					source={
						view.icon.path !== undefined ? view.icon.path : {uri: undefined}
					}
					style={styles.imageIcon}
				/>
			)
		default:
			return <Icon name="question" size={32} style={styles.icon} />
	}
}

export function HomeScreenButton({view, onPress}: Props): JSX.Element {
	let foreground =
		view.foreground === 'light' ? styles.lightForeground : styles.darkForeground

	return (
		<TouchableButton
			gradient={view.gradient}
			label={view.title}
			onPress={onPress}
			tint={view.tint}
		>
			<View style={styles.contents}>
				<HomeIcon foreground={foreground} view={view} />
				<Text style={[foreground, styles.text]}>{view.title}</Text>
			</View>
		</TouchableButton>
	)
}

type TouchableButtonProps = {
	onPress: () => void
	label: string
	children: React.ReactChildren | JSX.Element
	tint: string
	gradient?: [string, string]
}

function TouchableButton(props: TouchableButtonProps) {
	let {onPress, label, children, tint, gradient} = props

	if (Platform.OS === 'android') {
		return (
			<Tint gradient={gradient} tint={tint}>
				<TouchableWrapper label={label} onPress={onPress}>
					{children}
				</TouchableWrapper>
			</Tint>
		)
	} else {
		return (
			<TouchableWrapper label={label} onPress={onPress}>
				<Tint gradient={gradient} tint={tint}>
					{children}
				</Tint>
			</TouchableWrapper>
		)
	}
}

type TouchableWrapperProps = {
	onPress: () => void
	label: string
	children: React.ReactChildren | JSX.Element
}

function TouchableWrapper({onPress, children, label}: TouchableWrapperProps) {
	return (
		<Touchable
			accessibilityLabel={label}
			accessibilityRole="button"
			accessible={true}
			highlight={false}
			onPress={onPress}
		>
			{children}
		</Touchable>
	)
}

type TintProps = {
	children: React.ReactChildren | JSX.Element
	tint: string
	gradient?: [string, string]
}

function Tint({tint = 'black', gradient, children}: TintProps) {
	if (!gradient) {
		let bg = {backgroundColor: tint}
		return <View style={[styles.button, bg]}>{children}</View>
	}

	return (
		<LinearGradient
			colors={gradient}
			end={{x: 0, y: 0.85}}
			start={{x: 0, y: 0.05}}
			style={styles.button}
		>
			{children}
		</LinearGradient>
	)
}

export const CELL_MARGIN = 10
const cellVerticalPadding = 8
const cellHorizontalPadding = 4

const styles = StyleSheet.create({
	button: {
		elevation: 2,
		borderRadius: Platform.OS === 'ios' ? (hasNotch() ? 17 : 6) : 3,

		marginBottom: CELL_MARGIN,
		marginLeft: CELL_MARGIN / 2,
		marginRight: CELL_MARGIN / 2,
	},
	contents: {
		alignItems: 'center',
		justifyContent: 'center',

		paddingTop: cellVerticalPadding,
		paddingBottom: cellVerticalPadding / 2,
		paddingHorizontal: cellHorizontalPadding,
	},
	icon: {
		backgroundColor: transparent,
	},
	imageIcon: {
		height: 32,
		width: 32,
	},
	text: {
		backgroundColor: transparent,
		fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-condensed',
		fontSize: 14,
	},
	lightForeground: {
		color: homescreenForegroundLight,
	},
	darkForeground: {
		color: homescreenForegroundDark,
	},
})
