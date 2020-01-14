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
const STATUS_DETAIL = 'task/STATUS_DETAIL';
const CODE_DETAIL = 'task/CODE_DETAIL';
const TASK_DETAIL = 'task/TASK_DETAIL';

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
    task: {},
    formErrors: {},
    codes: [],
    code: {},
    statuses: [],
    status: {},
};


const taskReducer = (state=initialSate, action) => {

    switch (action.type) {
        case SET_TASK_LIST:
            return {
                ...state,
                ...action.results,
            };
        case SET_CODE_LIST:
        case SET_STATUS_LIST:
        case SET_FORM_ERROR_MESSAGES:
        case STATUS_DETAIL:
        case CODE_DETAIL:
        case TASK_DETAIL:
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
    results: results
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

export const setStatusDetailAction = (status) => ({
    type: STATUS_DETAIL,
    payload: {status}
});
export const setCodeDetailAction = (code) => ({
    type: CODE_DETAIL,
    payload: {code}
});
export const setTaskDetailAction = (task) => ({
    type: TASK_DETAIL,
    payload: {task}
});


// Thunks taskAPI
export const getTaskList = (page=1, filters = {}) => async (dispatch) => {
    dispatch(setLoadingAction(true));
    try{
        const response = await taskAPI.task_list(page, [filters]);
        dispatch(taskListAction(response.data));
    } catch (e) {
        errorHandler(e, dispatch);
    } finally {
        dispatch(setLoadingAction(false));
    }
};

export const createTask = (data) => async (dispatch) => {
    await taskAPI.create(data);
    dispatch(addSuccessMessage('Task has been created'));
    dispatch(redirectToAction('/tasks'));
};

export const getTaskDetail = (pk) => async (dispatch) => {
    wrappedDetail(taskAPI, pk, setTaskDetailAction, dispatch).then();
};

export const updateTask = (data) => async (dispatch) => {
    const msg = data.title + ' was updated successfully';
    wrappedUpdate(taskAPI, data, msg, '/tasks', dispatch).then();
};

export const deleteTask = (pk) => async (dispatch) => {
    wrappedDelete(taskAPI, pk, 'Task has been deleted', dispatch).then(
        () => dispatch(getCodeList())
    );
};

// Thunks codeAPI
export const getCodeList = () => async (dispatch) => {
    wrappedLoading(codesAPI.codes_list, codeListAction, dispatch).then()
};

export const createCode = (data) => async (dispatch) => {
    await codesAPI.create(data);
    dispatch(addSuccessMessage('Code has been created'));
    dispatch(redirectToAction('/settings'));
};

export const getCodeDetail = (pk) => async (dispatch) => {
    wrappedDetail(codesAPI, pk, setCodeDetailAction, dispatch).then();
};

export const updateCode = (data) => async (dispatch) => {
    const msg = data.code + ' was updated successfully';
    wrappedUpdate(codesAPI, data, msg, '/settings', dispatch).then();
};

export const setDefaultCodes = () => async (dispatch) => {
    const statusMapList = [
        {name: 'Edit information on the site', code: 'EDIT_SITE_INFO', comment: 'if you need to change company info or products etc'},
        {name: 'Change whois', code: 'CHANGE_WHOIS', comment: 'you can inform admin to change whois'},
        {name: 'Remind me', code: 'REMIND_ME', comment: 'use it if you want to remind yourself'},
        {name: 'Custom', code: 'CUSTOM', comment: 'use it if you want to create any task'},
    ];

    Promise.all(
        statusMapList.map(item => codesAPI.create(item))
    ).then(
        () => dispatch(getCodeList())
    );
};

export const deleteCode = (pk) => async (dispatch) => {
    wrappedDelete(codesAPI, pk, 'Code has been deleted', dispatch).then(
        () => dispatch(getCodeList())
    );
};


// Thunks statusAPI
export const getStatusList = () => async (dispatch) => {
    wrappedLoading(statusAPI.status_list, statusListAction, dispatch).then()
};

export const createStatus = (data) => async (dispatch) => {
    await statusAPI.create(data);
    dispatch(addSuccessMessage('Status has been created'));
    dispatch(redirectToAction('/settings'));
};

export const getStatusDetail = (pk) => async (dispatch) => {
    wrappedDetail(statusAPI, pk, setStatusDetailAction, dispatch).then();
};

export const updateStatus = (data) => async (dispatch) => {
    const msg = data.status + ' was updated successfully';
    wrappedUpdate(statusAPI, data, msg, '/settings', dispatch).then();
};

export const deleteStatus = (pk) => async (dispatch) => {
    wrappedDelete(statusAPI, pk, 'Status has been deleted', dispatch).then(
        () => dispatch(getStatusList())
    );
};

export const setDefaultStatuses = () => async (dispatch) => {
    const statusMapList = [
        {status: 'NEW', comment: 'new task'},
        {status: 'IN_PROGRESS', comment: 'task in progress'},
        {status: 'DONE', comment: 'task done'},
        {status: 'CANCELED', comment: 'task canceled'},
    ];

    Promise.all(
        statusMapList.map(item => statusAPI.create(item))
    ).then(
        () => dispatch(getStatusList())
    );
};

// wrapper
export const wrappedDetail = async (api, pk, action, dispatch) => {
    try{
        dispatch(setLoadingAction(true));
        const response = await api.detail(pk);
        dispatch(action(response.data));
        dispatch(setFormErrorsAction({}));
        dispatch(setLoadingAction(false))
    } catch (e) {
        dispatch(setFormErrorsAction(e.response.data));
        errorHandler(e, dispatch)
    }
};

const wrappedLoading = async (apiFunc, action, dispatch) => {
    dispatch(setLoadingAction(true));
    wrappedException(apiFunc, action, dispatch).then(
        () => dispatch(setLoadingAction(false)),
        () => dispatch(setLoadingAction(false))
    )
};

const wrappedException = async (apiFunc, action, dispatch) => {
    try{
        const response = await apiFunc();
        dispatch(action(response.data));
    } catch (e) {
        errorHandler(e, dispatch);
    }
};

export const wrappedUpdate = async (api, data, msg,redirect, dispatch) => {
    try{
        await api.patch_field(data.pk, {...data});
        dispatch(addSuccessMessage(msg));
        dispatch(redirectToAction(redirect));
        dispatch(setFormErrorsAction({}))
    } catch (e) {
        dispatch(setFormErrorsAction(e.response.data));
        errorHandler(e, dispatch)
    }
};

export const wrappedDelete = async (api, pk, msg, dispatch) => {
    try{
        await api.delete(pk);
        dispatch(addSuccessMessage(msg));
        dispatch(setFormErrorsAction({}));
    } catch (e) {
        dispatch(setFormErrorsAction(e.response.data));
        errorHandler(e, dispatch);
    }
};



export default taskReducer;