import {verifyToken} from "./auth-reducer";
import {setCurrentUser} from "./user-reducer";

const INITIALIZED_SUCCESS = 'app/INITIALIZED_SUCCESS';
const SHOW_MESSAGE = 'app/SHOW_MESSAGE';
const ADD_MESSAGE = 'app/ADD_MESSAGE';


const initialSate = {
    initialized: false,
    messages: [{
        id: 1,
        type: 'success',
        message: 'success 1'
    },
        {
            id: 2,
            type: 'warning',
            message: 'warning 2'
        }
    ]
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

export const showedMessage = (message) => async (dispatch) => {
    dispatch(showMessageAction(message))
};

export const addMessage = (message) => async (dispatch) => {
    dispatch(addMessageAction(message))
};

export const initializeApp = () => (dispatch) => {
    const token = localStorage.token;
    const verifyTokenPromise = token
        ? dispatch(verifyToken())
        : new Promise((resolve, reject) => reject(1));

    Promise.all([verifyTokenPromise]).then(
        () => {
            dispatch(setCurrentUser());
            dispatch(initializedSuccess());
        },
        () => {
            dispatch(initializedSuccess());
        });
};


export default appReducer;