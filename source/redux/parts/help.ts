import type {ReduxState} from '../index'
import type {ToolOptions} from '../../views/help/types'
import {fetch} from '@frogpond/fetch'
import {API} from '@frogpond/api'

type Dispatch<A extends Action> = (
	action: A | Promise<A> | ThunkAction<A>,
) => void
type GetState = () => ReduxState
type ThunkAction<A extends Action> = (
	dispatch: Dispatch<A>,
	getState: GetState,
) => void
type Action = GetEnabledToolsAction

const ENABLED_TOOLS_START = 'help/ENABLED_TOOLS/start'
const ENABLED_TOOLS_FAILURE = 'help/ENABLED_TOOLS/failure'
const ENABLED_TOOLS_SUCCESS = 'help/ENABLED_TOOLS/success'

type GetEnabledToolsStartAction = {type: 'help/ENABLED_TOOLS/start'}
type GetEnabledToolsSuccessAction = {
	type: 'help/ENABLED_TOOLS/success'
	payload: Array<ToolOptions>
}
type GetEnabledToolsFailureAction = {type: 'help/ENABLED_TOOLS/failure'}
type GetEnabledToolsAction =
	| GetEnabledToolsStartAction
	| GetEnabledToolsSuccessAction
	| GetEnabledToolsFailureAction

export type HelpAction = Action

export function getEnabledTools(): ThunkAction<GetEnabledToolsAction> {
	return async (dispatch) => {
		dispatch({type: ENABLED_TOOLS_START})

		try {
			const url = API('/tools/help')
			const body: {data: Array<ToolOptions>} = await fetch(url).json()

			dispatch({
				type: ENABLED_TOOLS_SUCCESS,
				payload: body.data,
			})
		} catch (err) {
			dispatch({type: ENABLED_TOOLS_FAILURE})
		}
	}
}

export type State = {
	readonly fetching: boolean
	readonly tools: Array<ToolOptions>
	readonly lastFetchError: boolean | null
}

const initialState: State = {
	fetching: false,
	tools: [],
	lastFetchError: null,
}

export function help(state: State = initialState, action: Action): State {
	switch (action.type) {
		case ENABLED_TOOLS_START:
			return {...state, fetching: true}

		case ENABLED_TOOLS_FAILURE:
			return {
				...state,
				fetching: false,
				lastFetchError: true,
			}

		case ENABLED_TOOLS_SUCCESS:
			return {
				...state,
				fetching: false,
				lastFetchError: false,
				tools: action.payload,
			}

		default:
			return state
	}
}
