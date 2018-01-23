// @flow
import * as React from 'react'
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native'
import * as c from './colors'
import {Button} from './button'
import {Heading} from './markdown/heading'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: c.white,
	},
	text: {
		textAlign: 'center',
	},
	spinner: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 8,
	},
})

type Props = {
	header?: string,
	text?: string,
	style?: any,
	spinner?: boolean,
	buttonText?: string,
	onPress?: () => any,
}

export function NoticeView({
	header,
	text,
	style,
	spinner,
	buttonText,
	onPress,
}: Props) {
	return (
		<View style={[styles.container, style]}>
			{spinner ? <ActivityIndicator style={styles.spinner} /> : null}

			<Heading level={1}>{header}</Heading>

			<Text selectable={true} style={styles.text}>
				{text || 'Notice!'}
			</Text>

			{buttonText ? <Button onPress={onPress} title={buttonText} /> : null}
		</View>
	)
}
