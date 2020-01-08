import {taskAPI, statusAPI, codesAPI} from "../api/api";
import {
    addSuccessMessage,
    errorHandler, redirectToAction,
    setLoadingAction
} from "./app-reducer";

const SET_TASK_LIST = 'task/SET_TASK_LIST';
const SET_CODE_LIST = 'task/SET_CODES_LIST';
const SET_STATUS_LIST = 'task/SET_STATUS_LIST';
const SET_FORM_ERROR_MESSAGES = 'task/SET_FORM_ERROR_MESSAGES';

const initialSate = {
    count: 0,
    next: null,
    previous: null,
    results: [{
        pk: 0,
        name: "",
        address: "",
        url: ""
    }],
    formErrors: {},
    codes: [],
    statuses: [],
};


const taskReducer = (state=initialSate, action) => {

    switch (action.type) {
        case SET_TASK_LIST:
        case SET_CODE_LIST:
        case SET_STATUS_LIST:
        case SET_FORM_ERROR_MESSAGES:
            return {
                ...state,
                ...action.payload,
            };
        default: return state;
    }
};

// Actions
export const taskListAction = (results) => ({
    type: SET_TASK_LIST,
    payload: {results}
});

export const codeListAction = (codes) => ({
    type: SET_CODE_LIST,
    payload: {codes}
});

export const statusListAction = (statuses) => ({
    type: SET_STATUS_LIST,
    payload: {statuses}
});

export const setFormErrorsAction = (formErrors) => ({
    type: SET_FORM_ERROR_MESSAGES,
    payload: {formErrors}
});



// Thunks taskAPI
export const getTaskList = () => async (dispatch) => {
    WrappedException(taskAPI.task_list, taskListAction, dispatch).then()
};


// Thunks codeAPI
export const getCodeList = () => async (dispatch) => {
    WrappedException(codesAPI.codes_list, codeListAction, dispatch).then()
};


// Thunks statusAPI


export const getStatusList = () => async (dispatch) => {
    WrappedException(statusAPI.status_list, statusListAction, dispatch).then()
};

export const updateStatus = (data) => async (dispatch) => {
    try{
        await statusAPI.patch_field(data.pk, {...data});
        const msg = data.status + ' was updated successfully';
        dispatch(addSuccessMessage(msg));
        dispatch(redirectToAction('/statuses'));
        dispatch(setFormErrorsAction({}))
    } catch (e) {
        const response = e.response;
        const errors = response.data;
        dispatch(setFormErrorsAction(errors))
    }

};

export const setDefaultStatuses = () => async (dispatch) => {
    const statusMapList = [
        {status: 'NEW', comment: 'new task'},
        {status: 'IN_PROGRESS', comment: 'task in progress'},
        {status: 'DONE', comment: 'task done'},
        {status: 'CANCELED', comment: 'task canceled'},
    ];

    statusMapList.map(item => statusAPI.create(item));
    dispatch(getStatusList())
};

// wrapper
const WrappedException = async (apiFunc, action, dispatch) => {
    dispatch(setLoadingAction(true));
    try{
        const response = await apiFunc();
        dispatch(action(response.data));
    } catch (e) {
        errorHandler(e, dispatch);
    } finally {
        dispatch(setLoadingAction(false));
    }
};



export default taskReducer;