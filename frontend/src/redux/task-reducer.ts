import {push, RouterAction} from "connected-react-router"
import {taskAPI, statusAPI, codesAPI} from "../api/api"
import {TBaseThunk, TInferActions} from "./redux-store"

import {
    addSuccessMessage,
    errorHandler,
} from "./app-reducer"



const SET_TASK_LIST = 'task/SET_TASK_LIST'
const SET_CODE_LIST = 'task/SET_CODES_LIST'
const SET_STATUS_LIST = 'task/SET_STATUS_LIST'
const SET_FORM_ERROR_MESSAGES = 'task/SET_FORM_ERROR_MESSAGES'
const STATUS_DETAIL = 'task/STATUS_DETAIL'
const CODE_DETAIL = 'task/CODE_DETAIL'
const TASK_DETAIL = 'task/TASK_DETAIL'


const initialState = {
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
}

type TInitialState = typeof initialState


const taskReducer = (state=initialState, action: TActions): TInitialState => {

    switch (action.type) {
        case SET_TASK_LIST:
            return {
                ...state,
                ...action.results,
            }
        case SET_CODE_LIST:
        case SET_STATUS_LIST:
        case SET_FORM_ERROR_MESSAGES:
        case STATUS_DETAIL:
        case CODE_DETAIL:
        case TASK_DETAIL:
            return {
                ...state,
                ...action.payload,
            }
        default: return state
    }
}

// ACTIONS
export const actions = {
    taskListAction: (results: any) => ({
        type: SET_TASK_LIST,
        results: results
    } as const),

    codeListAction: (codes: any) => ({
        type: SET_CODE_LIST,
        payload: {codes}
    } as const),

    statusListAction: (statuses: any) => ({
        type: SET_STATUS_LIST,
        payload: {statuses}
    } as const),

    setFormErrorsAction: (formErrors: any) => ({
        type: SET_FORM_ERROR_MESSAGES,
        payload: {formErrors}
    } as const),

    setStatusDetailAction: (status: any) => ({
        type: STATUS_DETAIL,
        payload: {status}
    } as const),

    setCodeDetailAction: (code: any) => ({
        type: CODE_DETAIL,
        payload: {code}
    } as const),

    setTaskDetailAction: (task: any) => ({
        type: TASK_DETAIL,
        payload: {task}
    } as const),
}


// THUNKS
export type TActions = TInferActions<typeof actions>
type TThunk = TBaseThunk<TActions | RouterAction>

export const getTaskList = (page=1, filters = {}): TThunk => async (dispatch) => {
    const response = await taskAPI.task_list(page, [filters])
    dispatch(actions.taskListAction(response.data))
}

export const createTask = (data: any): TThunk => async (dispatch) => {
    const e = await taskAPI.create(data)
    if (e?.error){
        dispatch(actions.setFormErrorsAction({...e}))
    } else {
        dispatch(addSuccessMessage('Task has been created'))
        dispatch(push('/tasks'))
    }
}

export const getTaskDetail = (pk: number): TThunk => async (dispatch) => {
    wrappedDetail(taskAPI, pk, actions.setTaskDetailAction, dispatch).then()
}

export const updateTask = (data: any): TThunk => async (dispatch) => {
    const msg = data.title + ' was updated successfully'
    wrappedUpdate(taskAPI, data, msg, '/tasks', dispatch).then()
}

export const deleteTask = (pk: number): TThunk => async (dispatch) => {
    wrappedDelete(taskAPI, pk, 'Task has been deleted', dispatch).then(
        () => dispatch(getCodeList())
    )
}

// THUNKS codeAPI
export const getCodeList = (): TThunk => async (dispatch) => {
    const data = await codesAPI.codes_list()
    dispatch(actions.codeListAction(data))
}

export const createCode = (data: any): TThunk => async (dispatch) => {
    await codesAPI.create(data)
    dispatch(addSuccessMessage('Code has been created'))
    dispatch(push('/settings'))
}

export const getCodeDetail = (pk: number): TThunk => async (dispatch) => {
    wrappedDetail(codesAPI, pk, actions.setCodeDetailAction, dispatch).then()
}

export const updateCode = (data: any): TThunk => async (dispatch) => {
    const msg = data.code + ' was updated successfully'
    wrappedUpdate(codesAPI, data, msg, '/settings', dispatch).then()
}

export const setDefaultCodes = (): TThunk => async (dispatch) => {
    const statusMapList = [
        {name: 'Edit information on the site', code: 'EDIT_SITE_INFO', comment: 'if you need to change company info or products etc'},
        {name: 'Change whois', code: 'CHANGE_WHOIS', comment: 'you can inform admin to change whois'},
        {name: 'Remind me', code: 'REMIND_ME', comment: 'use it if you want to remind yourself'},
        {name: 'Custom', code: 'CUSTOM', comment: 'use it if you want to create any task'},
    ]

    Promise.all(
        statusMapList.map(item => codesAPI.create(item))
    ).then(
        () => dispatch(getCodeList())
    )
}

export const deleteCode = (pk: number): TThunk => async (dispatch) => {
    await codesAPI.delete(pk)
    dispatch(addSuccessMessage('Code has been deleted'))
    dispatch(actions.setFormErrorsAction({}))
}


// THUNKS statusAPI
export const getStatusList = (): TThunk => async (dispatch) => {
    const data = await statusAPI.status_list()
    dispatch(actions.statusListAction(data))
}

export const createStatus = (data: any): TThunk => async (dispatch) => {
    await statusAPI.create(data)
    dispatch(addSuccessMessage('Status has been created'))
    dispatch(push('/settings'))
}

export const getStatusDetail = (pk: number): TThunk => async (dispatch) => {
    wrappedDetail(statusAPI, pk, actions.setStatusDetailAction, dispatch).then()
}

export const updateStatus = (data: any): TThunk => async (dispatch) => {
    const msg = data.status + ' was updated successfully'
    wrappedUpdate(statusAPI, data, msg, '/settings', dispatch).then()
}

export const deleteStatus = (pk: number): TThunk => async (dispatch) => {
    wrappedDelete(statusAPI, pk, 'Status has been deleted', dispatch).then(
        () => dispatch(getStatusList())
    )
}

export const setDefaultStatuses = (): TThunk => async (dispatch) => {
    const statusMapList = [
        {status: 'NEW', comment: 'new task'},
        {status: 'IN_PROGRESS', comment: 'task in progress'},
        {status: 'DONE', comment: 'task done'},
        {status: 'CANCELED', comment: 'task canceled'},
    ]

    Promise.all(
        statusMapList.map(item => statusAPI.create(item))
    ).then(
        () => dispatch(getStatusList())
    )
}

// wrapper
// todo create common wrapper
export const wrappedDetail = async (api: any, pk: number, action: any, dispatch: any) => {
    try{
        const response = await api.detail(pk)
        dispatch(action(response.data))
        dispatch(actions.setFormErrorsAction({}))
    } catch (e) {
        dispatch(actions.setFormErrorsAction(e.response.data))
        errorHandler(e, dispatch)
    }
}


export const wrappedUpdate = async (api: any, data: any, msg: any, redirect: any, dispatch: any) => {
    try{
        await api.patch_field(data.pk, {...data})
        dispatch(addSuccessMessage(msg))
        dispatch(push(redirect))
        dispatch(actions.setFormErrorsAction({}))
    } catch (e) {
        dispatch(actions.setFormErrorsAction(e.response.data))
        errorHandler(e, dispatch)
    }
}

export const wrappedDelete = async (api: any, pk: any, msg: any, dispatch: any) => {
    try{
        await api.delete(pk)
        dispatch(addSuccessMessage(msg))
        dispatch(actions.setFormErrorsAction({}))
    } catch (e) {
        dispatch(actions.setFormErrorsAction(e.response.data))
        errorHandler(e, dispatch)
    }
}



export default taskReducer