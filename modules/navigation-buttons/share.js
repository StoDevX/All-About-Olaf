// @flow

import * as React from 'react'
import {Platform} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {Touchable} from '@frogpond/touchable'
import {rightButtonStyles as styles} from './styles'

type Props = {
	onPress: () => any,
}

const iconName = Platform.OS === 'ios' ? 'ios-share-outline' : 'md-share'

export function ShareButton(props: Props) {
	return (
		<Touchable highlight={false} onPress={props.onPress} style={styles.button}>
			<Icon name={iconName} style={styles.icon} />
		</Touchable>
	)
}
