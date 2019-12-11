import {authAPI} from "../api/api";


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


export const verifyToken = (token) => async (dispatch) => {
    const response = await authAPI.verify(token);
    if (response.status === 200){
        let isAuth = true;
        dispatch(setAuthToken(isAuth))
    } else {
        let isAuth = true;
        dispatch(setAuthToken(isAuth))
    }

};

export const login = (email, password) => async (dispatch) => {
    const data = await authAPI.login(email, password);
    if (data.token){
        const isAuth = true;
        dispatch(setAuthToken(isAuth));
        localStorage.setItem("token", data.token)
    } else {
        debugger
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




export default authReducer;