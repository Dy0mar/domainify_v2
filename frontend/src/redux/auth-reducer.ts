import {authAPI} from "../api/api"
import {TActions as TActionsApp, actions as actionsApp} from "./user-reducer"
import {TBaseThunk, TInferActions} from "./redux-store"


const SET_AUTH_COMPLETE = 'auth/SET_AUTH_COMPLETE'
const LOGIN_ERROR_MESSAGES = 'auth/LOGIN_ERROR_MESSAGES'


const initialState = {
    isAuth: false,
    loginErrors: [] as Array<string>,
}

type TInitialState = typeof initialState

const authReducer = (state=initialState, action: TActions): TInitialState => {

    switch (action.type) {
        case SET_AUTH_COMPLETE:
        case LOGIN_ERROR_MESSAGES:
            return {
                ...state,
                ...action.payload,
            }

        default: return state
    }
}

// TYPES
export type TActions = TInferActions<typeof actions>


// ACTIONS
export const actions = {
    setAuthComplete: (isAuth: boolean) => ({
        type: SET_AUTH_COMPLETE, payload: {isAuth}
    } as const),
    loginErrorsAction: (loginErrors: Array<string>) => ({
        type: LOGIN_ERROR_MESSAGES,
        payload: {loginErrors}
    } as const)
}


// THUNKS
type TThunk = TBaseThunk<TActions | TActionsApp>

export const verifyToken = (): TThunk => async (dispatch) => {
    const token = localStorage.getItem("token")
    if (!token){
        dispatch(actions.setAuthComplete(false))
        return
    }

    const data = await authAPI.verify(token)
    if (data?.token)
        dispatch(actions.setAuthComplete(true))
    else
        dispatch(actions.setAuthComplete(false))
}

export const login = (username: string, password: string): TThunk => async (dispatch) => {
    const data = await authAPI.login(username, password)
    if (!!data?.token){
        localStorage.setItem("token", data.token)
        const {pk, username, email, profile, settings} = data.user
        dispatch(actionsApp.setCurrentUserAction(pk, username, email, profile, settings))
        dispatch(actions.setAuthComplete(true))
    } else {
        const errors = data.non_field_errors
        dispatch(actions.loginErrorsAction(errors))
    }
}

export const logout = (): TThunk => async (dispatch) => {
    const response = await authAPI.logout()
    if (response.status === 200){
        dispatch(actions.setAuthComplete(false))
        dispatch (actionsApp.setCurrentUserAction(
            0, "", "", {jabber_nick:''}, {email: false, jabber: false})
        )
        dispatch(actions.loginErrorsAction([]))
        localStorage.removeItem("token")
    }
}

export default authReducer