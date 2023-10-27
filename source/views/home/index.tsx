import * as React from 'react'
import {
	ImageBackground,
	SafeAreaView,
	ScrollView,
	View,
	StyleSheet,
	Platform,
} from 'react-native'
import {AllViews} from '../views'
import {Column} from '@frogpond/layout'
import {partitionByIndex} from '../../lib/partition-by-index'
import {HomeScreenButton, CELL_MARGIN} from './button'
import {openUrl} from '@frogpond/open-url'
import {OpenSettingsButton} from '@frogpond/navigation-buttons'
import {ContextMenu} from '@frogpond/context-menu'
import {UnofficialAppNotice} from './notice'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationOptions} from '@react-navigation/native-stack'
import {useAppBackground, useUpdateAppBackground} from './background'

const styles = StyleSheet.create({
	cells: {
		marginHorizontal: CELL_MARGIN / 2,
		paddingTop: CELL_MARGIN,

		flexDirection: 'row',
	},
	column: {
		flex: 1,
	},
	safearea: {
		flex: 1,
	},
	background: {
		flex: 1,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: -1,
		position: 'absolute',
	},
})

function HomePage(): JSX.Element {
	let navigation = useNavigation()
	let allViews = AllViews().filter((view) => !view.disabled ?? true)
	let columns = partitionByIndex(allViews)

	let {data: appBackgroundImage} = useAppBackground()
	const appBackground = useUpdateAppBackground()

	const SettingsContextButton = React.useMemo(() => {
		const OnPressMenuItem = (result: string) => {
			const typedResult = result as keyof typeof HomeNavbarButtonsEnum
			switch (typedResult) {
				case HomeNavbarButtonsEnum.Settings:
					navigation.navigate('Settings')
					break
				case HomeNavbarButtonsEnum.ChangeBackground: {
					appBackground.mutate()
					break
				}
				default:
					console.warn(`Unhandled tap on settings button item: ${result}`)
					break
			}
		}

		return (
			<ContextMenu
				actions={Object.values(HomeNavbarButtonsEnum)}
				isMenuPrimaryAction={true}
				onPressMenuItem={OnPressMenuItem}
				title=""
			>
				<OpenSettingsButton canGoBack={true} />
			</ContextMenu>
		)
	}, [appBackground, navigation])

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => SettingsContextButton,
		})
	}, [SettingsContextButton, navigation])

	const HomeScrollView = () => (
		<ScrollView
			alwaysBounceHorizontal={false}
			contentInsetAdjustmentBehavior="automatic"
			showsHorizontalScrollIndicator={false}
			showsVerticalScrollIndicator={false}
			testID="screen-homescreen"
		>
			<View style={styles.cells}>
				{columns.map((contents, i) => (
					<Column key={i} style={styles.column}>
						{contents.map((view) => (
							<HomeScreenButton
								key={view.type === 'view' ? view.view : view.title}
								onPress={() => {
									if (view.type === 'url') {
										return openUrl(view.url)
									} else if (view.type === 'view') {
										return navigation.navigate(view.view)
									} else {
										throw new Error(`unexpected view type ${view.type}`)
									}
								}}
								view={view}
							/>
						))}
					</Column>
				))}
			</View>

			<UnofficialAppNotice />
		</ScrollView>
	)

	return Platform.select({
		ios: (
			<SafeAreaView style={styles.safearea}>
				<HomeScrollView />
				{Boolean(appBackgroundImage) && (
					<ImageBackground
						resizeMode="cover"
						source={{uri: appBackgroundImage}}
						style={styles.background}
					/>
				)}
			</SafeAreaView>
		),
		android: <HomeScrollView />,
		default: <></>,
	})
}

const HomeNavbarButtonsEnum = {
	Settings: 'Settings',
	ChangeBackground: 'Change Background',
}

export {HomePage as View}

export const NavigationKey = 'Home'

export const NavigationOptions: NativeStackNavigationOptions = {
	title: 'All About Olaf',
	headerBackTitle: 'Home',
	headerLargeTitle: Platform.OS === 'ios',
	headerTransparent: Platform.OS === 'ios',
	headerBlurEffect: Platform.OS === 'ios' ? 'systemThinMaterial' : undefined,
}

export type NavigationParams = undefined
