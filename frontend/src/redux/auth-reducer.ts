import {TActions as TActionsUser, actions as userActions} from "./user-reducer"
import {authAPI} from "../api/auth-api"
import {TBaseThunk, TInferActions} from "./redux-store";


const SET_AUTH_COMPLETE = 'auth/SET_AUTH_COMPLETE'
const LOGIN_ERROR_MESSAGES = 'auth/LOGIN_ERROR_MESSAGES'


const initialState = {
    isAuth: false,
    loginErrors: '',
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
type TActions = TInferActions<typeof actions>

// ACTIONS
export const actions = {
    setAuthComplete: (isAuth: boolean) => ({type: SET_AUTH_COMPLETE, payload: {isAuth: isAuth} as const})
}

// THUNKS
type TThunk = TBaseThunk<TActions | TActionsUser>

export const verifyToken = (): TThunk => async (dispatch) => {
    const token = localStorage.getItem("token")
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
        const {pk, username, email, profile, settings } = data.user
        dispatch(userActions.setCurrentUserAction(pk, username, email, profile, settings))
        dispatch(actions.setAuthComplete(true))
    }
}

export const logout = (): TThunk => async (dispatch) => {
    await authAPI.logout()
    dispatch(actions.setAuthComplete(false))
    dispatch(userActions.setCurrentUserAction(0, "", "", undefined, undefined))
    localStorage.removeItem("token")
}

export default authReducer