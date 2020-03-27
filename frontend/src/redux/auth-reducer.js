import {authAPI} from "../api/api";
import {setCurrentUserAction, setUserInfo} from "./user-reducer";
import {errorHandler} from "./app-reducer";


const SET_AUTH_COMPLETE = 'auth/SET_AUTH_COMPLETE';
const LOGIN_ERROR_MESSAGES = 'auth/LOGIN_ERROR_MESSAGES';


const initialState = {
    isAuth: false,
    loginErrors: '',
};


const authReducer = (state=initialState, action) => {

    switch (action.type) {
        case SET_AUTH_COMPLETE:
        case LOGIN_ERROR_MESSAGES:
            return {
                ...state,
                ...action.payload,
            };

        default: return state;
    }
};

export const setAuthComplete = (isAuth) => ({
    type: SET_AUTH_COMPLETE,
    payload: {isAuth}
});

export const loginErrorsAction = (loginErrors) => ({
    type: LOGIN_ERROR_MESSAGES,
    payload: {loginErrors}
});


export const verifyToken = () => async (dispatch) => {
    try{
        const response = await authAPI.verify();
        if (response.status === 200){
            dispatch(setAuthComplete(true))
        } else {
            dispatch(setAuthComplete(false));
            return Promise.reject(response.data.message)
        }
    } catch (e) {
        errorHandler(e, dispatch);
    }
};

export const login = (username, password) => async (dispatch) => {
    try {
        const response = await authAPI.login(username, password);
        if (response.status === 200 && response.data.token){
            dispatch(setAuthComplete(true));
            localStorage.setItem("token", response.data.token);

            const {pk, username, email} = response.data.user;
            dispatch(setCurrentUserAction(pk, username, email));
            dispatch(setUserInfo(pk));
        }
    } catch (e) {
        if (e && e.response && e.response.data){
            const response = e.response;
            const errors = response.data.non_field_errors;
            dispatch(loginErrorsAction(errors))
        } else
            errorHandler(e, dispatch)
    }
};

export const logout = () => async (dispatch) => {
    const response = await authAPI.logout();
    if (response.status === 200){
        dispatch(setAuthComplete(false));
        dispatch(setCurrentUserAction(null, "", ""));
        localStorage.removeItem("token")
    }
};

export default authReducer;