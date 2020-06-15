import {verifyToken} from "./auth-reducer"
import {getManagerList, setCurrentUser} from "./user-reducer"
import {newMessage} from "./S/g-selector"
import {
    getAlexaStatusList,
    getDomainStatusList
} from "./domain-reducer"
import {getCompanyList} from "./company-reducer"
import {TBaseThunk, TInferActions} from "./redux-store"
import {TMessage} from "../types/g-types"

const INITIALIZED_SUCCESS = 'app/INITIALIZED_SUCCESS'
const SHOW_MESSAGE = 'app/SHOW_MESSAGE'
const ADD_MESSAGE = 'app/ADD_MESSAGE'
const SET_REDIRECT_TO = 'app/SET_REDIRECT_TO'
const SET_ERROR_INFO = 'app/SET_ERROR_INFO'
const SET_LOADING = 'app/SET_LOADING'


const initialState = {
    initialized: false,
    redirectTo: '',
    messages: [] as Array<TMessage>,
    errorInfo: '',
    isLoading: false
}

type TInitialState = typeof initialState

const appReducer = (state= initialState, action: TActions): TInitialState => {

    switch (action.type) {
        case SET_LOADING:
        case INITIALIZED_SUCCESS:
        case SET_REDIRECT_TO:
        case SET_ERROR_INFO:
            return {
                ...state,
                ...action.payload,
            }
        case SHOW_MESSAGE:
            return {
                ...state,
                // messages: state.messages.filter(m => m.id !== action.msg.id)
            }
        case ADD_MESSAGE:
            return {
                ...state,
                // messages: [...state.messages, action.msg]
            }
        default: return state
    }
}

// TYPES
export type TActions = TInferActions<typeof actions>

// ACTIONS
export const actions = {
    showMessageAction: (msg: TMessage) => ({type: SHOW_MESSAGE, msg: msg} as const),
    addMessageAction: (msg: TMessage) => ({type: ADD_MESSAGE, msg: msg} as const),
    initializedSuccess: (initialized: boolean) => ({type: INITIALIZED_SUCCESS, payload: {initialized}} as const),
    setAppLoading: (isLoading: boolean) => ({type: SET_LOADING, payload: {isLoading} as const}),
    redirectToAction: (redirectTo: string) => ({type: SET_REDIRECT_TO, payload: {redirectTo}} as const),
    setErrorInfoAction: (errorInfo: any) => ({type: SET_ERROR_INFO, payload: {errorInfo}} as const),
}

// THUNKS
type TThunk = TBaseThunk<TActions>

export const setRedirectTo = (redirectTo: string): TThunk => async (dispatch) => {
    dispatch(actions.redirectToAction(redirectTo))
}

export const showedMessage = (message: TMessage): TThunk => async (dispatch) => {
    dispatch(actions.showMessageAction(message))
}

export const addSuccessMessage = (msg: string): TThunk => async (dispatch, getState) => {
    const message = newMessage(getState(), 'success', msg)
    dispatch(actions.addMessageAction(message))
}

export const addErrorMessage = (msg: string): TThunk => async (dispatch, getState) => {
    const message = newMessage(getState(), 'error', msg)
    dispatch(actions.addMessageAction(message))
}

export const initializeApp = (): TThunk => async (dispatch) => {
    const token = localStorage.token
    let promises = [Promise.resolve()]
    if (token) {
        promises = [
            dispatch(verifyToken()),
            dispatch(setCurrentUser()),
            dispatch(getManagerList()),
            dispatch(getDomainStatusList()),
            dispatch(getAlexaStatusList()),
            dispatch(getCompanyList()),
        ]
    }
    // todo: add reject
    Promise.all(promises).finally( () => dispatch(actions.initializedSuccess(true)))
}

export const withProcessVisualization = function (operation: any, dispatch: any) {
    return async () => {
        dispatch(actions.setAppLoading(true))
        await operation()
        dispatch(actions.setAppLoading(false))
    }
}

export const commonAsyncHandler = (operation: any, dispatch: any) => {
    const visualized = withProcessVisualization(operation, dispatch)
    return visualized()
}

export const errorHandler = (e: any, dispatch: any) => {
    const pageError = '/503'
    let status = null
    if (e && e.response && e.response.status) {
        status = e.response.status
    }
    switch (status) {
        case 401:
            dispatch(actions.redirectToAction('/login'))
            break

        case 404:
        case 500:
            dispatch(actions.redirectToAction('/'+status))

            break
        default:
            dispatch(actions.redirectToAction(pageError))
            break
    }
    dispatch(actions.setErrorInfoAction(e))
}


export default appReducer