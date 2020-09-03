import { push, RouterAction } from 'connected-react-router'

import {companyAPI} from "../api/api"
import {
    addSuccessMessage,
    commonAsyncHandler,
} from "./app-reducer"
import {TCompany} from "../types/g-types"
import {TBaseThunk, TInferActions} from "./redux-store"


const SET_COMPANY_LIST = 'company/SET_COMPANY_LIST'
const SET_FORM_ERROR_MESSAGES = 'company/SET_FORM_ERROR_MESSAGES'


// LOCAL TYPES
type TCreateCompany = {
    name: string
    address: string
}

type TUpdateCompany = { pk: number } & TCreateCompany

// STATE
const initialState = {
    count: 0,
    next: null,
    previous: null,
    page_size: 10,
    results: [{
        pk: 0,
        name: "",
        address: "",
        url: ""
    }] as Array<TCompany>,
    formErrors: {},
}

type TInitialState = typeof initialState

const companyReducer = (state=initialState, action: TActions): TInitialState => {

    switch (action.type) {
        case SET_COMPANY_LIST:
        case SET_FORM_ERROR_MESSAGES:
            return {
                ...state,
                ...action.payload,
            }
        default: return state
    }
}

// ACTIONS
export const actions = {
    companyListAction: (results: Array<TCompany>, count: number, page_size: number) => ({
        type: SET_COMPANY_LIST,
        payload: {results, count, page_size}
    } as const),
    setFormErrorsAction: (formErrors: any) => ({
        type: SET_FORM_ERROR_MESSAGES,
        payload: {formErrors}
    } as const),
}


// THUNKS
export type TActions = TInferActions<typeof actions>
type TThunk = TBaseThunk<TActions | RouterAction>

export const getCompanyList = (page=1): TThunk => async (dispatch) => {
    await commonAsyncHandler(async () => {
        const data = await companyAPI.company_list(page)
        dispatch(actions.companyListAction(data.results, data.count, data.page_size))
    }, dispatch)
}

export const createCompany = (company_data: TCreateCompany): TThunk => async (dispatch) => {
    const {address, name} = company_data
    const data = await companyAPI.create({address, name})
    if (data?.error){
        delete(data.error)
        dispatch(actions.setFormErrorsAction(data))
    } else {
        dispatch(actions.setFormErrorsAction({}))
        dispatch(push('/companies'))
        dispatch(addSuccessMessage('Company has been created'))
    }
}

// todo: refactor it
export const updateCompany = (company_data: TUpdateCompany): TThunk => async (dispatch) => {
    try{
        const response = await companyAPI.patch_field(company_data.pk, {...company_data})
        const msg = response.data.name + ' data was updated successfully'

        dispatch(actions.setFormErrorsAction({}))
        dispatch(push('/companies'))
        dispatch(addSuccessMessage(msg))
    } catch (e) {
        const response = e.response
        const errors = response.data
        dispatch(actions.setFormErrorsAction(errors))
    }
}

export const deleteCompany = (pk: number): TThunk => async (dispatch) => {
    await companyAPI.delete(pk)
    const msg = 'Company has been deleted'
    await dispatch(addSuccessMessage(msg))
    await dispatch(getCompanyList())
    dispatch(actions.setFormErrorsAction({}))
}

export default companyReducer