import { push, RouterAction } from 'connected-react-router'

import {companyAPI} from "../api/api"
import {
    addSuccessMessage,
    commonAsyncHandler,
} from "./app-reducer"
import {TCompany} from "../types/g-types"
import {TBaseThunk, TInferActions} from "./redux-store"
import {TCreateCompany, TFormCompanyData} from "../types/company-types"


const SET_COMPANY_LIST = 'company/SET_COMPANY_LIST'
const SET_FORM_ERROR_MESSAGES = 'company/SET_FORM_ERROR_MESSAGES'


// STATE
const initialState = {
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
    companyListAction: (results: Array<TCompany>) => ({
        type: SET_COMPANY_LIST,
        payload: {results}
    } as const),
    setFormErrorsAction: (formErrors: any) => ({
        type: SET_FORM_ERROR_MESSAGES,
        payload: {formErrors}
    } as const),
}


// THUNKS
export type TActions = TInferActions<typeof actions>
type TThunk = TBaseThunk<TActions | RouterAction>

export const getCompanyList = (): TThunk => async (dispatch) => {
    await commonAsyncHandler(async () => {
        const data = await companyAPI.company_list()
        dispatch(actions.companyListAction(data))
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
        await dispatch(getCompanyList())
        dispatch(addSuccessMessage('Company has been created'))
    }
}

export const updateCompany = (companyId: number, company_data: TFormCompanyData): TThunk => async (dispatch) => {
    try{
        const response = await companyAPI.update(companyId, company_data)
        const msg = response.data.name + ' data was updated successfully'
        dispatch(actions.setFormErrorsAction({}))
        await dispatch(getCompanyList())
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