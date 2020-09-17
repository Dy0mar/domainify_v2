import {TAppState} from "../redux/redux-store"

export const isAuthS = (state: TAppState) => state.auth.isAuth
export const getLoginErrorsS = (state: TAppState) => state.auth.loginErrors
