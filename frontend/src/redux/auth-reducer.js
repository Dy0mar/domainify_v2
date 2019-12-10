import {authAPI} from "../api/api";


const SET_USER_DATA = 'auth/SET_USER_DATA';


const initialSate = {
    token: null,
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

export const setAuthToken = (token, isAuth) => ({
    type: SET_USER_DATA,
    payload: {token, isAuth}
});


export const checkAuthToken = (token) => async (dispatch) => {
    let data = null;
    if (token){
        data = await authAPI.verify(token);
    }
    let isAuth = true;
    dispatch(setAuthToken(token, isAuth))
};

export const login = (email, password) => async (dispatch) => {
    const data = await authAPI.login(email, password);
    if (data.token){
        const isAuth = true;
        const token = data.token;
        dispatch(setAuthToken(token, isAuth))
    }
};


export default authReducer;