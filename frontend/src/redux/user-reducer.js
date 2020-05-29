import {domainsAPI, usersAPI} from "../api/api";
import {login} from "./auth-reducer";
import {addSuccessMessage, errorHandler} from "./app-reducer";

const SET_CURRENT_USER = 'user/SET_CURRENT_USER';
const SET_USER_INFO = 'user/SET_CURRENT_USER';
const REGISTER_ERROR_MESSAGES = 'user/REGISTER_ERROR_MESSAGES';
const GET_USER_LIST = 'user/GET_USER_LIST';
const GET_MANAGER_LIST = 'user/GET_MANAGER_LIST';
const GET_FULL_USER_LIST = 'user/GET_FULL_USER_LIST';


const initialState = {
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
    registerErrors: {},
    users: {
        count: 0,
        next: null,
        previous: null,
        results: []
    },
    managers: []
};


const userReducer = (state=initialState, action) => {

    switch (action.type) {
        case SET_CURRENT_USER:
        case SET_USER_INFO:
        case REGISTER_ERROR_MESSAGES:
        case GET_USER_LIST:
        case GET_MANAGER_LIST:
            return {
                ...state,
                ...action.payload,
            };
        case GET_FULL_USER_LIST:
            return {
                ...state,
                users: {
                    ...state.users,
                    results: [...state.users.results, ...action.users]
                }
            };
        default: return state;
    }
};

// ACTIONS
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

export const userListAction = (users) => ({
    type: GET_USER_LIST,
    payload: {users}
});

export const userFullListAction = (users) => ({
    type: GET_FULL_USER_LIST,
    users: users
});

export const managersListAction = (managers) => ({
    type: GET_MANAGER_LIST,
    payload: {managers}
});


// THUNKS
export const getManagerList = (update=false) => async (dispatch, getState) => {
    //todo 291149: move to domain edit
    const managers = getState().user.managers;
    if (!update && managers?.length !== 0)
        return;
    try {
        const response = await domainsAPI.manager_list();
        dispatch(managersListAction(response.data.list))
    } catch (e) {
        errorHandler(e, dispatch)
    }
};

export const getUserList = (page=1) => async (dispatch) => {
    const response = await usersAPI.get_user_list(page);
    if (response.status === 200) {
        dispatch(userListAction(response.data));
    }
};

export const getUserFullList = () => async (dispatch) => {
    dispatch(userListAction({
        count: 0,
        next: null,
        previous: null,
        results: []
    }));
    let page = 1;
    do {
        let response = await usersAPI.get_user_list(page);
        dispatch(userFullListAction(response.data.results));
        response.data.next ? page++ : page=0
    } while (page)
};

export const register = (username, email, password, jabber_nick) => async (dispatch) => {
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
        if (e && e.response && e.response.data){
            const response = e.response;
            const errors = response.data;
            dispatch(registerErrorsAction(errors))
        }
        errorHandler(e, dispatch)
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

export const checkNotificationMethod = (method) => async (dispatch) => {
    const response = await usersAPI.check_notification_method(method);
    dispatch(addSuccessMessage(response.data))
};


export default userReducer;