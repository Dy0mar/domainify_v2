import {authAPI} from "../api/api";
import {setCurrentUserAction, setUserInfo} from "./user-reducer";
import {addErrorMessage} from "./app-reducer";


const SET_AUTH_COMPLETE = 'auth/SET_AUTH_COMPLETE';


const initialSate = {
    isAuth: false,
};


const authReducer = (state=initialSate, action) => {

    switch (action.type) {
        case SET_AUTH_COMPLETE:
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


export const verifyToken = () => async (dispatch) => {
    const response = await authAPI.verify();
    if (response.status === 200){
        dispatch(setAuthComplete(true))
    } else {
        dispatch(setAuthComplete(false));
        return Promise.reject(response.data.message)
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
        const response = e.response;
        const errors = response.data.non_field_errors;
        errors.forEach(msg => dispatch(addErrorMessage(msg)))
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