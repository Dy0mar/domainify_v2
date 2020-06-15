import {
    addSuccessMessage,
    actions as actionsApp, commonAsyncHandler,
    TActions as TActionsApp,
} from "./app-reducer"
import {companyAPI} from "../api/company-api"
import {TBaseThunk, TInferActions} from "./redux-store";
import {TCompany} from "../types/g-types";

const SET_COMPANY_LIST = 'company/SET_COMPANY_LIST'
const SET_FORM_ERROR_MESSAGES = 'company/SET_FORM_ERROR_MESSAGES'

const initialState = {
    count: 0,
    next: null,
    previous: null,
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

// TYPES
type TActions = TInferActions<typeof actions>

// ACTIONS
export const actions = {
    companyListAction: (results: Array<TCompany>) => ({ type: SET_COMPANY_LIST, payload: {results} as const}),
    // todo: any refactor
    setFormErrorsAction: (formErrors: any) => ({ type: SET_FORM_ERROR_MESSAGES, payload: {formErrors}})
}

// THUNKS
type TThunk = TBaseThunk<TActions | TActionsApp>

export const getCompanyList = (): TThunk => async (dispatch) => {
    await commonAsyncHandler(async () => {
        const data = await companyAPI.company_list()
        dispatch(actions.companyListAction(data))
    }, dispatch)
}

export const createCompany = (data: TCompany): TThunk => async (dispatch) => {
    try{
        await companyAPI.create(data)
        dispatch(addSuccessMessage('Company has been created'))
        dispatch(actionsApp.redirectToAction('/companies'))
        dispatch(actions.setFormErrorsAction({}))
    } catch (e) {
        const response = e.response
        const errors = response.data
        // dispatch(actions.setFormErrorsAction(errors))
    } finally {
        dispatch(actionsApp.setAppLoading(false))
    }
}

type TUpdateCompany = { pk: number }

export const updateCompany = (data: TUpdateCompany & TCompany): TThunk => async (dispatch) => {
    try{
        await companyAPI.patch_field(data.pk, {...data})
        const msg = data.name + ' data was updated successfully'
        dispatch(addSuccessMessage(msg))
        // dispatch(appActions.redirectToAction('/companies'))
        // dispatch(actions.setFormErrorsAction({}))
    } catch (e) {
        const response = e.response
        const errors = response.data
        // dispatch(actions.setFormErrorsAction(errors))
    }
}

export const deleteCompany = (pk: number): TThunk => async (dispatch) => {
    await companyAPI.delete(pk)
    const msg = 'Company has been deleted'
    dispatch(addSuccessMessage(msg))
    await dispatch(getCompanyList())
    // dispatch(actions.setFormErrorsAction({}))
}

export default companyReducer