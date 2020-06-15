import {addSuccessMessage, TActions as TActionsApp, actions as actionsApp, commonAsyncHandler} from "./app-reducer"
import {domainsAPI} from "../api/domain-api"
import {TBaseThunk, TInferActions} from "./redux-store"
import {TDomain, TEmails, TTelephones} from "../types/g-types"



const SET_CURRENT_DOMAIN = 'domain/SET_CURRENT_DOMAIN'
const SET_DOMAIN_STATUS_LIST = 'domain/SET_DOMAIN_STATUS_LIST'
const SET_ALEXA_STATUS_LIST = 'domain/SET_ALEXA_STATUS_LIST'

const SET_DOMAIN_LIST = 'domain/SET_DOMAIN_LIST'
// const GET_COMPANY_LIST = 'domain/GET_COMPANY_LIST'
const SET_FORM_ERROR_MESSAGES = 'domain/SET_FORM_ERROR_MESSAGES'
const AUTOCOMPLETE_DOMAIN_LIST = 'domain/AUTOCOMPLETE_DOMAIN_LIST'


const initialState = {
    count: null as number | null,
    next: null as string | null,
    previous: null as string | null,
    results: [{
        url: "",
        pk: 0,
        name: "",
        company: {
            pk: 0,
            name: '',
            address: '',
            url: ''
        },
        alexa_status: "",
        emails: [] as Array<TEmails>,
        telephones: [] as Array<TTelephones>,
        alexa_comment: "",
        redirect: "",
        register_date: "",
        expire_date: "",
        status: "",
        manager: {
            pk: 0,
            username: '',
            url: '',
        },
        use_custom_address: false,
        custom_company_address: ''
    }] as Array<TDomain>,

    statuses: [] as Array<string>,
    alexa_statuses: [] as Array<string>,
    formErrors: {},
    redirectTo: '',
    currentDomain: {},
    dataSource: [],
}

type TInitialState = typeof initialState

const domainsReducer = (state=initialState, action: TActions): TInitialState => {

    switch (action.type) {
        case SET_CURRENT_DOMAIN:
        case SET_DOMAIN_STATUS_LIST:
        case SET_ALEXA_STATUS_LIST:
        case SET_DOMAIN_LIST:
        // case GET_COMPANY_LIST:
        case SET_FORM_ERROR_MESSAGES:
        case AUTOCOMPLETE_DOMAIN_LIST:
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

     domainListAction: (count: number, next: null | string, previous: null | string, results: Array<TDomain>) => ({
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
type TThunk = TBaseThunk<TActions | TActionsApp>

export const domainCreate = (data: any): TThunk => async (dispatch) => {
    await commonAsyncHandler(async () => {
        await domainsAPI.create(data)
        await dispatch(addSuccessMessage('Domain has been created'))
        dispatch(actionsApp.redirectToAction('/domains'))
        actions.setFormErrorsAction({})
    }, dispatch)
}

export const updateDomain = (data: any): TThunk => async (dispatch) => {
    try{
        //todo: refactor this
        await domainsAPI.patch_field(data.pk, {...data})
        const msg = data.name + ' data was updated successfully'
        await dispatch(addSuccessMessage(msg))
        dispatch(actionsApp.redirectToAction('/domains/' + data.pk))
        actions.setFormErrorsAction({})
    } catch (e) {
        const response = e.response
        const errors = response.data
        actions.setFormErrorsAction(errors)
    } finally {
        dispatch(actionsApp.setAppLoading(false))
    }
}

export const deleteDomain = (pk: number): TThunk => async (dispatch) => {
    await commonAsyncHandler(async () => {
        await domainsAPI.delete(pk)
        dispatch(actions.setCurrentDomainAction({}))
        actionsApp.redirectToAction('/domains')
    }, dispatch)
}

export const loadCurrentDomain = (pk: number): TThunk => async (dispatch) => {
    await commonAsyncHandler(async () => {
        const data = await domainsAPI.domain_detail(pk)
        dispatch(actions.setCurrentDomainAction(data))
    }, dispatch)
}

export const getDomainStatusList = (): TThunk => async (dispatch) => {
    //todo 291149: move to domain edit
    const data = await domainsAPI.status_list()
    actions.domainStatusListAction(data.list)
}

export const getAlexaStatusList = (): TThunk => async (dispatch) => {
    //todo 291149: move to domain edit
    const data = await domainsAPI.alexa_status_list()
    actions.alexaStatusListAction(data.list)
}

export const getDomainList = (page=1, filters = {}): TThunk => async (dispatch) => {
    await commonAsyncHandler(async () => {
        const data = await domainsAPI.domain_list(page, [filters])
        const {count, next, previous, results} = data
        dispatch(actions.domainListAction(count, next, previous, results))
    }, dispatch)
}

export const autocompleteDomainList = (term: string): TThunk => async (dispatch) => {
    await commonAsyncHandler(async () => {
        const data = await domainsAPI.autocomplete_domain_list(term)
        dispatch(actions.autocompleteDomainListAction(data.list))
    }, dispatch)
}

export default domainsReducer