import {usersAPI} from "../api/api";
import {login} from "./auth-reducer";

const SET_CURRENT_USER = 'user/SET_CURRENT_USER';
const SET_USER_INFO = 'user/SET_CURRENT_USER';


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


export const register = (username, email, password, jabber_nick) => async (dispatch) => {
    // todo: show error message
    const profile = {
        'jabber_nick': jabber_nick,
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
    }
};

export default userReducer;