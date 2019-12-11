import {authAPI, usersAPI} from "../api/api";


const SET_USER_DATA = 'auth/SET_USER_DATA';


const initialSate = {
    isAuth: false,
};


const authReducer = (state=initialSate, action) => {

    switch (action.type) {
        case SET_USER_DATA:
            return {
                ...state,
                ...action.payload,
            };

        default: return state;
    }
};

export const setAuthToken = (isAuth) => ({
    type: SET_USER_DATA,
    payload: {isAuth}
});


export const verifyToken = () => async (dispatch) => {
    const response = await authAPI.verify();
    if (response.status === 200){
        let isAuth = true;
        dispatch(setAuthToken(isAuth))
    } else {
        let isAuth = true;
        dispatch(setAuthToken(isAuth))
    }

};

export const login = (username, password) => async (dispatch) => {
    const data = await authAPI.login(username, password);
    if (data.token){
        const isAuth = true;
        dispatch(setAuthToken(isAuth));
        localStorage.setItem("token", data.token)
    } else {
        console.log(data.message)
    }
};

export const logout = () => async (dispatch) => {
    const response = await authAPI.logout();
    if (response.status === 200){
        const isAuth = false;
        dispatch(setAuthToken(isAuth));
        localStorage.removeItem("token")
    }
};

export const register = (username, email, password, pidgin) => async (dispatch) => {
    const response = await usersAPI.register(username, email, password, pidgin);
    if (response.status === 200){
        const isAuth = false;
        dispatch(setAuthToken(isAuth));
        localStorage.removeItem("token")
    }
};





export default authReducer;