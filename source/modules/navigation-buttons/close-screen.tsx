import * as React from 'react'
import {Text, Platform, StyleSheet, ViewStyle, StyleProp} from 'react-native'
import {Touchable} from '../touchable'
import {commonStyles} from './styles'
import {useNavigation} from 'expo-router'
import {useTheme} from '../app-theme'

interface Props {
	title?: string
	buttonStyle?: StyleProp<ViewStyle>
}

export function CloseScreenButton({
	title,
	buttonStyle,
}: Props): React.JSX.Element {
	let navigation = useNavigation()
	let {colors} = useTheme()

	return (
		<Touchable
			accessibilityLabel="Close the screen"
			accessibilityRole="button"
			accessible={true}
			borderless={true}
			highlight={false}
			onPress={() => {
				navigation.goBack()
			}}
			style={[commonStyles.button, buttonStyle]}
			testID="button-close-screen"
		>
			<Text style={[commonStyles.text, styles.text, {color: colors.primary}]}>
				{title ?? 'Done'}
			</Text>
		</Touchable>
	)
}

const styles = StyleSheet.create({
	text: {
		...Platform.select({
			ios: {
				fontWeight: '600',
			},
			android: {
				fontWeight: '400',
			},
		}),
	},
})
