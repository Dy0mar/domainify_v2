import {verifyToken} from "./auth-reducer";
import {getManagerList, setCurrentUser} from "./user-reducer";
import {newMessage} from "../selectors/g-selector";
import {
    getAlexaStatusList,
    getDomainStatusList
} from "./domain-reducer";
import {getCompanyList} from "./company-reducer";
import {ThunkAction} from "redux-thunk";
import {TAppState} from "./redux-store";
import {TMessage} from "../types/g-types";

const INITIALIZED_SUCCESS = 'app/INITIALIZED_SUCCESS';
const SHOW_MESSAGE = 'app/SHOW_MESSAGE';
const ADD_MESSAGE = 'app/ADD_MESSAGE';
const SET_REDIRECT_TO = 'app/SET_REDIRECT_TO';
const SET_ERROR_INFO = 'app/SET_ERROR_INFO';
const SET_LOADING = 'app/SET_LOADING';


const initialState = {
    initialized: false,
    redirectTo: '',
    messages: [] as Array<TMessage>,
    errorInfo: '',
    isLoading: false
};

type InitialStateType = typeof initialState
type TActions = TInitializedSuccess
    | TRedirectToAction
    | TSetErrorInfoAction
    | TShowMessageAction
    | TAddMessageAction
    | TSetLoadingAction

const appReducer = (state=initialState, action: TActions): InitialStateType => {

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
                messages: state.messages.filter(m => m.id !== action.message.id)
            };
        case ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.message]
            };

        default: return state;
    }
};

// TYPES
type TInitializedSuccess = {
    type: typeof INITIALIZED_SUCCESS,
    payload: { initialized: boolean }
}
type TRedirectToAction = {
    type: typeof SET_REDIRECT_TO
    payload: { redirectTo: string }
}
type TSetErrorInfoAction = {
    type: typeof SET_ERROR_INFO
    payload: {errorInfo: any }
}
type TShowMessageAction = {
    type: typeof SHOW_MESSAGE
    message: TMessage
}
type TAddMessageAction = {
    type: typeof ADD_MESSAGE
    message: TMessage
}
type TSetLoadingAction = {
    type: typeof SET_LOADING
    payload: { isLoading: boolean }
}

// ACTIONS
export const initializedSuccess = (initialized=true): TInitializedSuccess => ({
    type: INITIALIZED_SUCCESS,
    payload: {initialized}
});

export const redirectToAction = (redirectTo: string): TRedirectToAction => ({
    type: SET_REDIRECT_TO,
    payload: {redirectTo}
});

export const setErrorInfoAction = (errorInfo: any): TSetErrorInfoAction => ({
    type: SET_ERROR_INFO,
    payload: {errorInfo}
});

export const showMessageAction = (message: TMessage): TShowMessageAction => ({
    type: SHOW_MESSAGE,
    message
});

export const addMessageAction = (message: TMessage): TAddMessageAction => ({
    type: ADD_MESSAGE,
    message
});

export const setLoadingAction = (isLoading: boolean): TSetLoadingAction => ({
    type: SET_LOADING,
    payload: {isLoading}
});

// THUNKS
type TThunkVoid = ThunkAction<void, TAppState, unknown, TActions>
type TThunk = ThunkAction<Promise<void>, TAppState, unknown, TActions>

export const setRedirectTo = (redirectTo: string): TThunk => async (dispatch) => {
    dispatch(redirectToAction(redirectTo));
};

export const showedMessage = (message: TMessage): TThunkVoid => (dispatch) => {
    dispatch(showMessageAction(message))
};

export const addSuccessMessage = (msg: string): TThunkVoid => (dispatch, getState) => {
    const message = newMessage(getState(), 'success', msg);
    dispatch(addMessageAction(message))
};

export const addErrorMessage = (msg: string): TThunkVoid => (dispatch, getState) => {
    const message = newMessage(getState(), 'error', msg);
    dispatch(addMessageAction(message))
};

export const initializeApp = () => async (dispatch: any) => {
    const token = localStorage.token
    let promises = [Promise.resolve()]
    if (token) {
        promises = [
            dispatch(verifyToken()),
            dispatch(setCurrentUser()),
            dispatch(getManagerList()),
            dispatch(getDomainStatusList()),
            dispatch(getAlexaStatusList()),
            dispatch(getCompanyList()),
        ]
    }
    // todo: add catch
    Promise.all(promises).finally( () => dispatch(initializedSuccess(true)))
}

export const errorHandler = (e: any, dispatch: any) => {
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