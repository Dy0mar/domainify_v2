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

export const setCurrentUser = (username, email, profile, settings) => ({
    type: SET_CURRENT_USER,
    payload: {username, email, profile, settings}
});


export const register = (username, email, password, pidgin) => async (dispatch) => {
    const profile = {'profile': {
        'pidgin': pidgin,
    }};
    const response = await usersAPI.register(username, email, password, profile);

    if (response.status === 201){
        const data = response.data;
        dispatch(setCurrentUser(username, email, data.profile, data.settings));
        dispatch(login(username, password));
    }
};

export default userReducer;