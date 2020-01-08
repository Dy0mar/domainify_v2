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
    code: {},
    statuses: [],
    status: {},
};


const taskReducer = (state=initialSate, action) => {

    switch (action.type) {
        case SET_TASK_LIST:
        case SET_CODE_LIST:
        case SET_STATUS_LIST:
        case SET_FORM_ERROR_MESSAGES:
        case STATUS_DETAIL:
        case CODE_DETAIL:
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

export const setStatusDetailAction = (status) => ({
    type: STATUS_DETAIL,
    payload: {status}
});
export const setCodeDetailAction = (code) => ({
    type: CODE_DETAIL,
    payload: {code}
});


// Thunks taskAPI
export const getTaskList = () => async (dispatch) => {
    wrappedLoading(taskAPI.task_list, taskListAction, dispatch).then()
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
    try{
        const response = await codesAPI.code_detail(pk);
        dispatch(setCodeDetailAction(response.data));
        dispatch(setFormErrorsAction({}))
    } catch (e) {
        dispatch(setFormErrorsAction(e.response.data))
    }
};

export const updateCode = (data) => async (dispatch) => {
    try{
        await codesAPI.patch_field(data.pk, {...data});
        const msg = data.code + ' was updated successfully';
        dispatch(addSuccessMessage(msg));
        dispatch(redirectToAction('/settings'));
        dispatch(setFormErrorsAction({}))
    } catch (e) {
        dispatch(setFormErrorsAction(e.response.data))
    }
};

export const setDefaultCodes = () => async (dispatch) => {
    const statusMapList = [
        {name: 'Edit information on the site', code: 'EDIT_SITE_INFO', comment: 'if you need to change company info or products etc'},
        {name: 'Change whois', code: 'CHANGE_WHOIS', comment: 'you can inform admin to change whois'},
        {name: 'remind me', code: 'REMIND_ME', comment: 'use it if you want to remind yourself'},
    ];

    Promise.all(
        statusMapList.map(item => codesAPI.create(item))
    ).then(
        () => dispatch(getCodeList())
    );
};

export const deleteCodes = (pk) => async (dispatch) => {
    deleteWrapper(codesAPI, pk, 'Code has been deleted', dispatch).then(
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
    try{
        const response = await statusAPI.status_detail(pk);
        dispatch(setStatusDetailAction(response.data));
        dispatch(setFormErrorsAction({}))
    } catch (e) {
        dispatch(setFormErrorsAction(e.response.data))
    }
};

export const updateStatus = (data) => async (dispatch) => {
    try{
        await statusAPI.patch_field(data.pk, {...data});
        const msg = data.status + ' was updated successfully';
        dispatch(addSuccessMessage(msg));
        dispatch(redirectToAction('/settings'));
        dispatch(setFormErrorsAction({}))
    } catch (e) {
        dispatch(setFormErrorsAction(e.response.data))
    }
};

export const deleteStatus = (pk) => async (dispatch) => {
    deleteWrapper(statusAPI, pk, 'Status has been deleted', dispatch).then(
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
const wrappedLoading = async (apiFunc, action, dispatch) => {
    dispatch(setLoadingAction(true));
    wrappedException(apiFunc, action, dispatch).then(
        () => dispatch(setLoadingAction(true)),
        () => dispatch(setLoadingAction(true))
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

export const deleteWrapper = async (api, pk, msg, dispatch) => {
    try{
        await api.delete(pk);
        dispatch(addSuccessMessage(msg));
        dispatch(setFormErrorsAction({}));
    } catch (e) {
        dispatch(setFormErrorsAction(e.response.data))
    }
};

export const setDefault = async (api, mapList, dispatch) => {
    Promise.all(
        mapList.map(item => api.create(item))
    ).then(
        () => dispatch(getStatusList())
    );
};



export default taskReducer;