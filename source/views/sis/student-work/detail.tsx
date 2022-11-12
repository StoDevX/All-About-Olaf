import {Platform} from 'react-native'

import {
	View as IosDetail,
	NavigationOptions as IosDetailNavigationOptions,
} from './detail-ios'
import {
	View as AndroidDetail,
	NavigationOptions as AndroidDetailNavigationOptions,
} from './detail-android'

const StudentWorkDetailView = Platform.OS === 'ios' ? IosDetail : AndroidDetail

export {StudentWorkDetailView as View}

export const NavigationOptions =
	Platform.OS === 'ios'
		? IosDetailNavigationOptions
		: AndroidDetailNavigationOptions
