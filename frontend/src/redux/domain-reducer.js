import {domainsAPI} from "../api/api";
import {addSuccessMessage} from "./app-reducer";

const GET_DOMAIN_LIST = 'domain/GET_DOMAIN_LIST';
const GET_DOMAIN_STATUS_LIST = 'domain/GET_DOMAIN_STATUS_LIST';
const GET_ALEXA_STATUS_LIST = 'domain/GET_ALEXA_STATUS_LIST';
const GET_COMPANY_LIST = 'domain/GET_COMPANY_LIST';
const CREATE_FORM_ERROR_MESSAGES = 'domain/CREATE_FORM_ERROR_MESSAGES';
const LOAD_CURRENT_DOMAIN = 'domain/LOAD_CURRENT_DOMAIN';


const initialSate = {
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
    isLoading: true,
    statuses: [],
    alexa_statuses: [],
    companies: [],
    formErrors: {},
    redirectTo: '',
    currentDomain: {},
};


const domainsReducer = (state=initialSate, action) => {

    switch (action.type) {
        case GET_DOMAIN_LIST:
        case GET_DOMAIN_STATUS_LIST:
        case GET_ALEXA_STATUS_LIST:
        case GET_COMPANY_LIST:
        case CREATE_FORM_ERROR_MESSAGES:
        case LOAD_CURRENT_DOMAIN:
            return {
                ...state,
                ...action.payload,
            };
        default: return state;
    }
};

// Actions
export const isLoadingAction = (isLoading) => ({
    type: GET_DOMAIN_LIST,
    payload: {isLoading}
});

export const setCurrentDomainAction = (currentDomain) => ({
    type: GET_DOMAIN_LIST,
    payload: {currentDomain}
});

export const redirectToAction = (redirectTo) => ({
    type: GET_DOMAIN_LIST,
    payload: {redirectTo}
});

export const domainStatusListAction = (statuses) => ({
    type: GET_DOMAIN_STATUS_LIST,
    payload: {statuses}
});

export const alexaStatusListAction = (alexa_statuses) => ({
    type: GET_ALEXA_STATUS_LIST,
    payload: {alexa_statuses}
});

export const companyListAction = (companies) => ({
    type: GET_ALEXA_STATUS_LIST,
    payload: {companies}
});

export const domainListAction = ({count, next, previous, results}) => ({
    type: GET_DOMAIN_LIST,
    payload: {count, next, previous, results}
});

export const setFormErrorsAction = (formErrors) => ({
    type: CREATE_FORM_ERROR_MESSAGES,
    payload: {formErrors}
});

// Thunks
export const setRedirectTo = (redirectTo) => async (dispatch) => {
    dispatch(redirectToAction(redirectTo));
};

export const domainCreate = (data) => async (dispatch) => {
    try{
        dispatch(isLoadingAction(true));
        const response = await domainsAPI.create(data);
        if (response.status === 201){
            dispatch(addSuccessMessage('Domain has been created'));
            dispatch(redirectToAction('/domains'));
            dispatch(setFormErrorsAction({}));
        }
    } catch (e) {
        const response = e.response;
        const errors = response.data;
        dispatch(setFormErrorsAction(errors))
    } finally {
        dispatch(isLoadingAction(false));
    }
};

export const updateDomain = (data) => async (dispatch) => {
    try{
        await domainsAPI.patch_field(data.pk, {...data});
        const msg = data.name + ' data was updated successfully';
        dispatch(addSuccessMessage(msg));
        dispatch(redirectToAction('/domains/'+data.pk));
        dispatch(setFormErrorsAction({}))
    } catch (e) {
        const response = e.response;
        const errors = response.data;
        dispatch(setFormErrorsAction(errors))
    } finally {
        dispatch(isLoadingAction(false));
    }
};

export const deleteDomain = (pk) => async (dispatch) => {
    dispatch(isLoadingAction(true));
    try{
        await domainsAPI.delete(pk);
        dispatch(setCurrentDomainAction({}));
        dispatch(redirectToAction('/domains'));
    } catch (e) {
        exception(e, dispatch)
    } finally {
        dispatch(isLoadingAction(false));
    }
};

export const loadCurrentDomain = (pk) => async (dispatch) => {
    dispatch(isLoadingAction(true));
    try{
        const response = await domainsAPI.domain_detail(pk);
        dispatch(setCurrentDomainAction(response.data));
    } catch (e) {
        exception(e, dispatch)
    } finally {
        dispatch(isLoadingAction(false));
    }
};

export const getDomainStatusList = () => async (dispatch) => {
    try{
        const response = await domainsAPI.status_list();
        dispatch(domainStatusListAction(response.data));
    } catch (e) {
        exception(e)
    }
};

export const getAlexaStatusList = () => async (dispatch) => {
    try{
        const response = await domainsAPI.alexa_status_list();
        dispatch(alexaStatusListAction(response.data));
    } catch (e) {
        exception(e)
    }
};

export const getCompanyList = () => async (dispatch) => {
    try{
        const response = await domainsAPI.company_list();
        dispatch(companyListAction(response.data));
    } catch (e) {
        exception(e)
    }
};

export const getDomainList = (page=1, filters = {}) => async (dispatch) => {
    dispatch(isLoadingAction(true));
    try{
        const response = await domainsAPI.get_domain_list(page, [filters]);
        dispatch(domainListAction(response.data));
    } catch (e) {
        exception(e)
    } finally {
        dispatch(isLoadingAction(false));
    }
};

const exception = (e, dispatch) => {
    const page404 = '/404';
    if (e && e.response && e.response.status) {
        switch (e.response.status) {
            case 404: dispatch(redirectToAction(page404)); break;
            default: dispatch(redirectToAction(page404)); break;
        }
    }
};

export default domainsReducer;