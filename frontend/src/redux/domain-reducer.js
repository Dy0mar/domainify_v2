import {domainsAPI} from "../api/api";

const GET_DOMAIN_LIST = 'domain/GET_DOMAIN_LIST';
const GET_MANAGERS_LIST = 'domain/GET_MANAGER_LIST';


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
    managers: [],
    statuses: [],
    alexa_statuses: [],
    companies: [],
    createFormErrors: []
};


const domainsReducer = (state=initialSate, action) => {

    switch (action.type) {
        case GET_DOMAIN_LIST:
        case GET_MANAGERS_LIST:
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

export const domainListAction = ({count, next, previous, results}) => ({
    type: GET_DOMAIN_LIST,
    payload: {count, next, previous, results}
});

export const managersListAction = (managers) => ({
    type: GET_MANAGERS_LIST,
    payload: {managers}
});


// Thunks
export const getManagersList = (update=false) => async (dispatch, getState) => {
    const managers_list = getState().domains.managers;
    if (!update && managers_list.length !== 0)
        return;

    try {
        const response = await domainsAPI.managers_list();
        dispatch(managersListAction(response.data))
    } catch (e) {
        console.log(e)
    }
};

export const getDomainList = (page=1, filters = {}) => async (dispatch) => {
    dispatch(isLoadingAction(true));
    try{
        const response = await domainsAPI.get_domain_list(page, [filters]);
        dispatch(domainListAction(response.data));
        dispatch(getManagersList())
    } catch (e) {
        console.log(e)
    } finally {
        dispatch(isLoadingAction(false));
    }
};

export default domainsReducer;