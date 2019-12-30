import {domainsAPI} from "../api/api";
import {addSuccessMessage} from "./app-reducer";

const GET_DOMAIN_LIST = 'domain/GET_DOMAIN_LIST';
const GET_DOMAIN_STATUS_LIST = 'domain/GET_DOMAIN_STATUS_LIST';
const GET_ALEXA_STATUS_LIST = 'domain/GET_ALEXA_STATUS_LIST';
const GET_COMPANY_LIST = 'domain/GET_COMPANY_LIST';


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
    createFormErrors: [],
    redirectTo: ''
};


const domainsReducer = (state=initialSate, action) => {

    switch (action.type) {
        case GET_DOMAIN_LIST:
        case GET_DOMAIN_STATUS_LIST:
        case GET_ALEXA_STATUS_LIST:
        case GET_COMPANY_LIST:
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

// Thunks
export const domainCreate = (data) => async (dispatch) => {
    try{
        dispatch(isLoadingAction(true));
        const response = await domainsAPI.create(data);
        if (response.status === 201){
            dispatch(addSuccessMessage('Domain has been created'));
            dispatch(redirectToAction('/domains'));
        }
    } catch (e) {
        console.log(e)
    } finally {
        dispatch(isLoadingAction(false));
    }
};

export const setRedirectTo = (redirectTo) => async (dispatch) => {
    dispatch(redirectToAction(redirectTo));
};

export const getDomainStatusList = () => async (dispatch) => {
    try{
        const response = await domainsAPI.status_list();
        dispatch(domainStatusListAction(response.data));
    } catch (e) {
        console.log(e)
    }
};

export const getAlexaStatusList = () => async (dispatch) => {
    try{
        const response = await domainsAPI.alexa_status_list();
        dispatch(alexaStatusListAction(response.data));
    } catch (e) {
        console.log(e)
    }
};

export const getCompanyList = () => async (dispatch) => {
    try{
        const response = await domainsAPI.company_list();
        dispatch(companyListAction(response.data));
    } catch (e) {
        console.log(e)
    }
};

export const getDomainList = (page=1, filters = {}) => async (dispatch) => {
    dispatch(isLoadingAction(true));
    try{
        const response = await domainsAPI.get_domain_list(page, [filters]);
        dispatch(domainListAction(response.data));
    } catch (e) {
        console.log(e)
    } finally {
        dispatch(isLoadingAction(false));
    }
};

export default domainsReducer;