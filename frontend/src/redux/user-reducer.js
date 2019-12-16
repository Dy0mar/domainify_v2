import {usersAPI} from "../api/api";
import {login} from "./auth-reducer";

const SET_CURRENT_USER = 'user/SET_CURRENT_USER';
const SET_USER_INFO = 'user/SET_CURRENT_USER';


const initialSate = {
    pk: null,
    username: "",
    email: "",
    profile: {
        pidgin: ""
    },
    settings: {
        pidgin: null,
        email: null
    },
};


const userReducer = (state=initialSate, action) => {

    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                ...action.payload,
            };
        case SET_USER_INFO:
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


export const register = (username, email, password, pidgin) => async (dispatch) => {
    // todo: show error message
    const profile = {
        'pidgin': pidgin,
    };
    const response = await usersAPI.register(username, email, password, profile);

    if (response.status === 201){
        const pk = response.data.pk;
        dispatch(setCurrentUserAction(pk, username, email));
        dispatch(login(username, password));
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
        const {profile, settings} = response.data;
        dispatch(setUserInfoAction(profile, settings));
    }
};

export const updateUserProfile = (data) => async (dispatch, getState) => {

    const user = getState().user;

    const pk = user.pk;
    const {email, pidgin, settingsPidgin, settingsEmail} = data;

    const profile = {};
    if (pidgin && pidgin !== user.profile.pidgin){
        profile.pidgin = pidgin;
    }

    const settings = {};
    if (typeof(settingsPidgin) === 'boolean')
        settings.settings['pidgin'] = settingsPidgin;

    if (typeof(settingsEmail) === 'boolean')
        settings.settings['email'] = settingsEmail;

    const response = await usersAPI.patch_field(pk, {email, profile, settings});

    if (response.status === 200){

        const {pk, username, email, profile, settings} = response.data;
        dispatch(setCurrentUserAction(pk, username, email));
        dispatch(setUserInfoAction(profile, settings));
    }
};

export default userReducer;