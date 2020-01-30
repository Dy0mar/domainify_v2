import {verifyToken} from "./auth-reducer";
import {getManagerList, setCurrentUser} from "./user-reducer";
import {newMessage} from "./users-selectors";
import {
    getAlexaStatusList,
    getDomainStatusList
} from "./domain-reducer";
import {getCompanyList} from "./company-reducer";

const INITIALIZED_SUCCESS = 'app/INITIALIZED_SUCCESS';
const SHOW_MESSAGE = 'app/SHOW_MESSAGE';
const ADD_MESSAGE = 'app/ADD_MESSAGE';
const SET_REDIRECT_TO = 'app/SET_REDIRECT_TO';
const SET_ERROR_INFO = 'app/SET_ERROR_INFO';
const SET_LOADING = 'app/SET_LOADING';


const initialSate = {
    initialized: false,
    redirectTo: '',
    messages: [],
    errorInfo: '',
    isLoading: false
};


const appReducer = (state=initialSate, action) => {

    switch (action.type) {
        case INITIALIZED_SUCCESS:
        case SET_REDIRECT_TO:
        case SET_ERROR_INFO:
        case SET_LOADING:
            return {
                ...state,
                ...action.payload,
            };
        case SHOW_MESSAGE:
            return {
                ...state,
                messages: state.messages.filter(m => parseInt(m.id) !== parseInt(action.message.id))
            };
        case ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.message]
            };

        default: return state;
    }
};


// Actions
export const initializedSuccess = (initialized=true) => ({
    type: INITIALIZED_SUCCESS,
    payload: {initialized}
});

export const redirectToAction = (redirectTo) => ({
    type: SET_REDIRECT_TO,
    payload: {redirectTo}
});

export const setErrorInfoAction = (errorInfo) => ({
    type: SET_ERROR_INFO,
    payload: {errorInfo}
});

export const showMessageAction = (message) => ({
    type: SHOW_MESSAGE,
    message
});

export const addMessageAction = (message) => ({
    type: ADD_MESSAGE,
    message
});

export const setLoadingAction = (isLoading) => ({
    type: SET_LOADING,
    payload: {isLoading}
});

// Thunks
export const setRedirectTo = (redirectTo) => async (dispatch) => {
    dispatch(redirectToAction(redirectTo));
};

export const showedMessage = (message) => (dispatch) => {
    dispatch(showMessageAction(message))
};

export const addSuccessMessage = (msg) => (dispatch, getState) => {
    const message = newMessage(getState(), 'success', msg);
    dispatch(addMessageAction(message))
};

export const addErrorMessage = (msg) => (dispatch, getState) => {
    const message = newMessage(getState(), 'error', msg);
    dispatch(addMessageAction(message))
};

export const initializeApp = () => (dispatch) => {
    const token = localStorage.token;
    const verifyTokenPromise = token
        ? dispatch(verifyToken())
        : new Promise((resolve, reject) => reject(1));

    verifyTokenPromise.then(
        () => {
            const setManagers = dispatch(getManagerList());
            const setDomainStatuses = dispatch(getDomainStatusList());
            const setAlexaStatuses = dispatch(getAlexaStatusList());
            const setCompanies = dispatch(getCompanyList());
            Promise.all([
                setManagers, setDomainStatuses, setAlexaStatuses, setCompanies
            ]).then(
                () => {
                    dispatch(setCurrentUser());
                    dispatch(initializedSuccess());
                    },
                () => {
                    dispatch(initializedSuccess());
                });
        },
        () => {
            dispatch(initializedSuccess());
        });
};

export const errorHandler = (e, dispatch) => {
    const pageError = '/503';
    let status = null;
    if (e && e.response && e.response.status) {
        status = e.response.status
    }
    switch (status) {
        case 401:
            dispatch(redirectToAction('/login'));
            break;

        case 404:
        case 500:
            dispatch(redirectToAction('/'+status));

            break;
        default: dispatch(redirectToAction(pageError)); break;
    }
    dispatch(setErrorInfoAction(e));
};


export default appReducer;