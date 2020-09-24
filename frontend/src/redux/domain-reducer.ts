import {push, RouterAction} from "connected-react-router"
import {domainsAPI} from "../api/api"
import {
    addErrorMessage,
    addSuccessMessage,
    commonAsyncHandler,
    errorHandler
} from "./app-reducer"
import {TBaseThunk, TInferActions} from "./redux-store"
import {TDomain} from "../types/g-types";


const SET_CURRENT_DOMAIN = 'domain/SET_CURRENT_DOMAIN'
const SET_DOMAIN_STATUS_LIST = 'domain/SET_DOMAIN_STATUS_LIST'
const SET_ALEXA_STATUS_LIST = 'domain/SET_ALEXA_STATUS_LIST'

const SET_DOMAIN_LIST = 'domain/SET_DOMAIN_LIST'
const SET_FORM_ERROR_MESSAGES = 'domain/SET_FORM_ERROR_MESSAGES'
const AUTOCOMPLETE_DOMAIN_LIST = 'domain/AUTOCOMPLETE_DOMAIN_LIST'


const initialState = {
    count: 0,
    next: null,
    previous: null,
    results: [{
        url: "",
        name: "",
        company: {
            name: "",
            address: "",
            url: ""
        },
        alexa_status: "",
        emails: [],
        telephones: [],
        alexa_comment: "",
        redirect: "",
        register_date: "",
        expire_date: "",
        status: "",
        manager: {
            "username": "",
            "url": ""
        }
    }],
    statuses: [],
    alexa_statuses: [],
    formErrors: {},
    currentDomain: {} as TDomain,
    dataSource: [],
}

type TInitialState = typeof initialState

const domainsReducer = (state=initialState, action: TActions): TInitialState => {

    switch (action.type) {
        case SET_CURRENT_DOMAIN:
        case SET_DOMAIN_STATUS_LIST:
        case SET_ALEXA_STATUS_LIST:
        case SET_DOMAIN_LIST:
        case SET_FORM_ERROR_MESSAGES:
        case AUTOCOMPLETE_DOMAIN_LIST:
            return {
                ...state,
                ...action.payload,
            }
        default: return state
    }
}

// ACTIONS
export const actions ={
    setCurrentDomainAction: (currentDomain: any) => ({
        type: SET_CURRENT_DOMAIN,
        payload: {currentDomain}
    } as const),

    domainStatusListAction: (statuses: any) => ({
        type: SET_DOMAIN_STATUS_LIST,
        payload: {statuses}
    } as const),

    alexaStatusListAction: (alexa_statuses: any) => ({
        type: SET_ALEXA_STATUS_LIST,
        payload: {alexa_statuses}
    } as const),

    domainListAction: (count: any, next: any, previous: any, results: any) => ({
        type: SET_DOMAIN_LIST,
        payload: {count, next, previous, results}
    } as const),

    setFormErrorsAction: (formErrors: any) => ({
        type: SET_FORM_ERROR_MESSAGES,
        payload: {formErrors}
    } as const),

    autocompleteDomainListAction: (dataSource: any) => ({
        type: AUTOCOMPLETE_DOMAIN_LIST,
        payload: {dataSource}
    } as const),
}


// THUNKS
export type TActions = TInferActions<typeof actions>
type TThunk = TBaseThunk<TActions | RouterAction>

export const domainCreate = (data: any): TThunk => async (dispatch) => {
    try{
        const response = await domainsAPI.create(data)
        if (response.status === 201){
            dispatch(push('/domains'))
            dispatch(actions.setFormErrorsAction({}))
            dispatch(addSuccessMessage('Domain has been created'))
        }
    } catch (e) {
        const response = e.response
        const errors = response.data
        dispatch(actions.setFormErrorsAction(errors))
    }
}

export const updateDomain = (data: any): TThunk => async (dispatch) => {
    try{
        await domainsAPI.patch_field(data.pk, {...data})
        const msg = data.name + ' data was updated successfully'
        dispatch(push('/domains/'+data.pk))
        dispatch(actions.setFormErrorsAction({}))
        dispatch(addSuccessMessage(msg))
    } catch (e) {
        const response = e.response
        const errors = response.data
        dispatch(actions.setFormErrorsAction(errors))
    }
}

export const deleteDomain = (pk: number): TThunk => async (dispatch) => {
    try{
        await domainsAPI.delete(pk)
        dispatch(actions.setCurrentDomainAction({}))
        dispatch(push('/domains'))
    } catch (e) {
        errorHandler(e, dispatch)
    }
}

export const loadCurrentDomain = (pk: number): TThunk => async (dispatch) => {
    const data = await domainsAPI.domain_detail(pk)
    dispatch(actions.setCurrentDomainAction(data))
}

export const actualize_whois = (pk: number): TThunk => async (dispatch) => {
    await commonAsyncHandler( async () => {
        const data = await domainsAPI.actualize_whois(pk)
        if (data?.error){
            dispatch(addErrorMessage(data.message))
        } else {
            dispatch(actions.setCurrentDomainAction(data))
        }
    }, dispatch)
}

export const getDomainStatusList = (): TThunk => async (dispatch) => {
    const data = await domainsAPI.status_list()
    dispatch(actions.domainStatusListAction(data.results))
}

export const getAlexaStatusList = (): TThunk => async (dispatch) => {
    const data = await domainsAPI.alexa_status_list()
    dispatch(actions.alexaStatusListAction(data.results))
}

export const getDomainList = (page=1, filters = {}): TThunk => async (dispatch) => {
    await commonAsyncHandler( async () => {
        const data = await domainsAPI.domain_list(page, [filters])
        const {count, next, previous, results} = data
        dispatch(actions.domainListAction(count, next, previous, results))
    }, dispatch)
}

export const autocompleteDomainList = (term: string): TThunk => async (dispatch) => {
    const data = await domainsAPI.autocomplete_domain_list(term)
    dispatch(actions.autocompleteDomainListAction(data.results))
}

export default domainsReducer