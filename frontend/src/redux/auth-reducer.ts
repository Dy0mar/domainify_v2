import {authAPI} from "../api/api"
import {setCurrentUserAction} from "./user-reducer"
import {errorHandler} from "./app-reducer"
import {TBaseThunk, TInferActions} from "./redux-store"


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
export type TActions = TInferActions<typeof actions>


// ACTIONS
export const actions = {
    setAuthComplete: (isAuth: boolean) => ({
        type: SET_AUTH_COMPLETE, payload: {isAuth}
    } as const),
    loginErrorsAction: (loginErrors: any) => ({
        type: LOGIN_ERROR_MESSAGES,
        payload: {loginErrors}
    } as const)
}


// THUNKS
type TThunk = TBaseThunk<TActions>

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
    try {
        const response = await authAPI.login(username, password)
        if (response.status === 200 && response.data.token){
            dispatch(actions.setAuthComplete(true))
            localStorage.setItem("token", response.data.token)

            const {pk, username, email, profile, settings} = response.data.user
            // todo: dispatch it
            setCurrentUserAction(pk, username, email, profile, settings)
        }
    } catch (e) {
        if (e && e.response && e.response.data){
            const response = e.response
            const errors = response.data.non_field_errors
            dispatch(actions.loginErrorsAction(errors))
        } else
            errorHandler(e, dispatch)
    }
}

export const logout = (): TThunk => async (dispatch) => {
    const response = await authAPI.logout()
    if (response.status === 200){
        dispatch(actions.setAuthComplete(false))
        // todo: dispatch it
        setCurrentUserAction(null, "", "", {}, {})
        localStorage.removeItem("token")
    }
}

export default authReducer