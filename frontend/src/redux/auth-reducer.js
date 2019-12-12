import {authAPI} from "../api/api";
import {getCurrentUser, setCurrentUser} from "./user-reducer";


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
        let isAuth = true;
        dispatch(setAuthComplete(isAuth))
    } else {
        let isAuth = false;
        dispatch(setAuthComplete(isAuth));
        return Promise.reject(response.data.message)
    }

};

export const login = (username, password) => async (dispatch) => {
    const data = await authAPI.login(username, password);
    if (data.token){
        const isAuth = true;
        dispatch(setAuthComplete(isAuth));
        localStorage.setItem("token", data.token);
        dispatch(getCurrentUser());
    } else {
        console.log(data.message)
    }
};

export const logout = () => async (dispatch) => {
    const response = await authAPI.logout();
    if (response.status === 200){
        const isAuth = false;
        dispatch(setAuthComplete(isAuth));
        dispatch(setCurrentUser("", ""));
        localStorage.removeItem("token")
    }
};

export default authReducer;