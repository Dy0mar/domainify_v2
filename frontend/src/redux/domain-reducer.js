import {domainsAPI} from "../api/api";
import {addSuccessMessage, errorHandler} from "./app-reducer";

const SET_LOADING = 'domain/SET_LOADING';
const SET_CURRENT_DOMAIN = 'domain/SET_CURRENT_DOMAIN';
const SET_REDIRECT_TO = 'domain/SET_REDIRECT_TO';
const SET_DOMAIN_STATUS_LIST = 'domain/SET_DOMAIN_STATUS_LIST';
const SET_ALEXA_STATUS_LIST = 'domain/SET_ALEXA_STATUS_LIST';

const SET_DOMAIN_LIST = 'domain/SET_DOMAIN_LIST';
const GET_COMPANY_LIST = 'domain/GET_COMPANY_LIST';
const SET_FORM_ERROR_MESSAGES = 'domain/SET_FORM_ERROR_MESSAGES';


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
    formErrors: {},
    redirectTo: '',
    currentDomain: {},
};


const domainsReducer = (state=initialSate, action) => {

    switch (action.type) {
        case SET_LOADING:
        case SET_CURRENT_DOMAIN:
        case SET_REDIRECT_TO:
        case SET_DOMAIN_STATUS_LIST:
        case SET_ALEXA_STATUS_LIST:
        case SET_DOMAIN_LIST:
        case GET_COMPANY_LIST:
        case SET_FORM_ERROR_MESSAGES:
            return {
                ...state,
                ...action.payload,
            };
        default: return state;
    }
};

// Actions
export const setLoadingAction = (isLoading) => ({
    type: SET_LOADING,
    payload: {isLoading}
});

export const setCurrentDomainAction = (currentDomain) => ({
    type: SET_CURRENT_DOMAIN,
    payload: {currentDomain}
});

export const redirectToAction = (redirectTo) => ({
    type: SET_REDIRECT_TO,
    payload: {redirectTo}
});

export const domainStatusListAction = (statuses) => ({
    type: SET_DOMAIN_STATUS_LIST,
    payload: {statuses}
});

export const alexaStatusListAction = (alexa_statuses) => ({
    type: SET_ALEXA_STATUS_LIST,
    payload: {alexa_statuses}
});

export const domainListAction = ({count, next, previous, results}) => ({
    type: SET_DOMAIN_LIST,
    payload: {count, next, previous, results}
});

export const setFormErrorsAction = (formErrors) => ({
    type: SET_FORM_ERROR_MESSAGES,
    payload: {formErrors}
});

// Thunks
export const setRedirectTo = (redirectTo) => async (dispatch) => {
    dispatch(redirectToAction(redirectTo));
};

export const domainCreate = (data) => async (dispatch) => {
    try{
        dispatch(setLoadingAction(true));
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
        dispatch(setLoadingAction(false));
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
        dispatch(setLoadingAction(false));
    }
};

export const deleteDomain = (pk) => async (dispatch) => {
    dispatch(setLoadingAction(true));
    try{
        await domainsAPI.delete(pk);
        dispatch(setCurrentDomainAction({}));
        dispatch(redirectToAction('/domains'));
    } catch (e) {
        errorHandler(e, dispatch);
    } finally {
        dispatch(setLoadingAction(false));
    }
};

export const loadCurrentDomain = (pk) => async (dispatch) => {
    dispatch(setLoadingAction(true));
    try{
        const response = await domainsAPI.domain_detail(pk);
        dispatch(setCurrentDomainAction(response.data));
    } catch (e) {
        errorHandler(e, dispatch);
    } finally {
        dispatch(setLoadingAction(false));
    }
};

export const getDomainStatusList = () => async (dispatch) => {
    try{
        const response = await domainsAPI.status_list();
        dispatch(domainStatusListAction(response.data));
    } catch (e) {
        errorHandler(e, dispatch);
    }
};

export const getAlexaStatusList = () => async (dispatch) => {
    try{
        const response = await domainsAPI.alexa_status_list();
        dispatch(alexaStatusListAction(response.data));
    } catch (e) {
        errorHandler(e, dispatch);
    }
};

export const getDomainList = (page=1, filters = {}) => async (dispatch) => {
    dispatch(setLoadingAction(true));
    try{
        const response = await domainsAPI.get_domain_list(page, [filters]);
        dispatch(domainListAction(response.data));
    } catch (e) {
        errorHandler(e, dispatch);
    } finally {
        dispatch(setLoadingAction(false));
    }
};

export default domainsReducer;