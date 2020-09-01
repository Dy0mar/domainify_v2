import {usersAPI, authAPI, domainsAPI} from "../api/api";
import {login} from "./auth-reducer";
import {
    addSuccessMessage,
    commonAsyncHandler,
    errorHandler
} from "./app-reducer";

const SET_CURRENT_USER = 'user/SET_CURRENT_USER';
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
        page_size: 10,
        results: []
    },
    managers: []
};


const userReducer = (state=initialState, action) => {

    switch (action.type) {
        case SET_CURRENT_USER:
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
                    results: [...action.users]
                }
            };
        default: return state;
    }
};

// ACTIONS
export const setCurrentUserAction = (pk, username, email, profile, settings) => ({
    type: SET_CURRENT_USER,
    payload: {pk, username, email, profile, settings}
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
// todo move to domains reducer
export const getManagerList = (update=false) => async (dispatch, getState) => {
    const managers = getState().user.managers;
    if (!update && managers.length !== 0)
        return;
    const data = await domainsAPI.manager_list();
    dispatch(managersListAction(data.results))
};

export const getUserList = (page=1) => async (dispatch) => {
    await commonAsyncHandler( async () => {
        const data = await usersAPI.get_user_list(page)
        dispatch(userListAction(data))
    }, dispatch)
};

// todo: get all users from back
export const getUserFullList = () => async (dispatch) => {
    let data = await usersAPI.get_all_user_list();
    dispatch(userFullListAction(data.results));
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
    const data = await authAPI.me()
    const {pk, username, email, profile, settings} = data
    dispatch(setCurrentUserAction(pk, username, email, profile, settings))
}


export const updateUserProfile = (data) => async (dispatch, getState) => {

    const user = getState().user;
    const data = await usersAPI.patch_field(user.pk, {...data});
    const {pk, username, email, profile, settings} = data;
    dispatch(setCurrentUserAction(pk, username, email, profile, settings));
    const msg = 'User updated successfully';
    dispatch(addSuccessMessage(msg));
};

export const checkNotificationMethod = (method) => async (dispatch) => {
    const response = await usersAPI.check_notification_method(method);
    dispatch(addSuccessMessage(response.data))
};


export default userReducer;