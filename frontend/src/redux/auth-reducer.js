import {authAPI} from "../api/api";
import {setCurrentUserAction} from "./user-reducer";


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
    // todo: show error message
    const data = await authAPI.login(username, password);
    if (data.token){
        dispatch(setAuthComplete(true));
        localStorage.setItem("token", data.token);

        const {pk, username, email} = data.user;
        dispatch(setCurrentUserAction(pk, username, email));
    } else {
        console.log(data.message)
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