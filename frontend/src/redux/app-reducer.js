import {verifyToken} from "./auth-reducer";
import {getManagerList, setCurrentUser} from "./user-reducer";
import {newMessage} from "./users-selectors";
import {
    getAlexaStatusList,
    getCompanyList,
    getDomainStatusList
} from "./domain-reducer";

const INITIALIZED_SUCCESS = 'app/INITIALIZED_SUCCESS';
const SHOW_MESSAGE = 'app/SHOW_MESSAGE';
const ADD_MESSAGE = 'app/ADD_MESSAGE';


const initialSate = {
    initialized: false,
    messages: []
};


const appReducer = (state=initialSate, action) => {

    switch (action.type) {
        case INITIALIZED_SUCCESS:
            return {
                ...state,
                initialized: true,
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


export const initializedSuccess = () => ({
    type: INITIALIZED_SUCCESS,
});

export const showMessageAction = (message) => ({
    type: SHOW_MESSAGE,
    message
});

export const addMessageAction = (message) => ({
    type: ADD_MESSAGE,
    message
});

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

    const setManagers = dispatch(getManagerList());
    const setDomainStatuses = dispatch(getDomainStatusList());
    const setAlexaStatuses = dispatch(getAlexaStatusList());
    const setCompanies = dispatch(getCompanyList());

    Promise.all([
        verifyTokenPromise, setManagers, setDomainStatuses, setAlexaStatuses,
        setCompanies
    ]).then(
        () => {
            dispatch(setCurrentUser());
            dispatch(initializedSuccess());
        },
        () => {
            dispatch(initializedSuccess());
        });
};


export default appReducer;