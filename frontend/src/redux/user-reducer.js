import {usersAPI} from "../api/api";
import {login} from "./auth-reducer";
import {addSuccessMessage} from "./app-reducer";

const SET_CURRENT_USER = 'user/SET_CURRENT_USER';
const SET_USER_INFO = 'user/SET_CURRENT_USER';
const REGISTER_ERROR_MESSAGES = 'user/REGISTER_ERROR_MESSAGES';


const initialSate = {
    pk: null,
    username: "",
    email: "",
    profile: {
        jabber_nick: ""
    },
    settings: {
        jabber: null,
        email: null
    },
    registerErrors: {}
};


const userReducer = (state=initialSate, action) => {

    switch (action.type) {
        case SET_CURRENT_USER:
        case SET_USER_INFO:
        case REGISTER_ERROR_MESSAGES:
            return {
                ...state,
                ...action.payload,
            };
        default: return state;
    }
};

export const setCurrentUserAction = (pk, username, email) => ({
    type: SET_CURRENT_USER,
    payload: {pk, username, email}
});

export const setUserInfoAction = (profile, settings) => ({
    type: SET_USER_INFO,
    payload: {profile, settings}
});

export const registerErrorsAction = (registerErrors) => ({
    type: REGISTER_ERROR_MESSAGES,
    payload: {registerErrors}
});


export const register = (username, email, password, jabber_nick) => async (dispatch) => {
    // todo: show error message
    const profile = {
        'jabber_nick': jabber_nick,
    };
    try{
        const response = await usersAPI.register(username, email, password, profile);

        if (response.status === 201){
            const pk = response.data.pk;
            dispatch(setCurrentUserAction(pk, username, email));
            dispatch(login(username, password));
        }
    } catch (e) {
        const response = e.response;
        const errors = response.data;
        dispatch(registerErrorsAction(errors))
    }

};

export const setCurrentUser = () => async (dispatch) => {

    const response = await usersAPI.me();

    if (response.status === 200){
        const {pk, username, email} = response.data;
        dispatch(setCurrentUserAction(pk, username, email));
        dispatch(setUserInfo(pk));
    }
};

export const setUserInfo = (pk) => async (dispatch) => {
    const response = await usersAPI.get_user_info(pk);

    if (response.status === 200){
        let {profile, settings} = response.data;
        settings = settings ? settings : {};
        dispatch(setUserInfoAction(profile, settings));
    }
};

export const updateUserProfile = (data) => async (dispatch, getState) => {

    const user = getState().user;
    const response = await usersAPI.patch_field(user.pk, {...data});

    if (response.status === 200){

        const {pk, username, email, profile, settings} = response.data;
        dispatch(setCurrentUserAction(pk, username, email));
        dispatch(setUserInfoAction(profile, settings));
        const msg = Object.keys(data) + ' data was updated successfully';
        dispatch(addSuccessMessage(msg));
    }
};

export default userReducer;