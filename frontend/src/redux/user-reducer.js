import {usersAPI} from "../api/api";
import {login} from "./auth-reducer";

const SET_CURRENT_USER = 'user/SET_CURRENT_USER';


const initialSate = {
    username: "",
    email: "",
    profile: {
        pidgin: ""
    },
    settings: null,
};


const userReducer = (state=initialSate, action) => {

    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                ...action.payload,
            };

        default: return state;
    }
};

export const setCurrentUser = (username, email) => ({
    type: SET_CURRENT_USER,
    payload: {username, email}
});


export const register = (username, email, password, pidgin) => async (dispatch) => {
    // todo: show error message
    const profile = {'profile': {
        'pidgin': pidgin,
    }};
    const response = await usersAPI.register(username, email, password, profile);

    if (response.status === 201){
        dispatch(setCurrentUser(username, email));
        dispatch(login(username, password));
    }
};

export const getCurrentUser = () => async (dispatch) => {

    const response = await usersAPI.getUser();

    if (response.status === 200){

        const {username, email} = response.data;
        dispatch(setCurrentUser(username, email));
    }
};


export default userReducer;