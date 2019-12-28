import {domainsAPI} from "../api/api";

const GET_DOMAIN_LIST = 'domain/GET_DOMAIN_LIST';


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
    createFormErrors: []
};


const domainsReducer = (state=initialSate, action) => {

    switch (action.type) {
        case GET_DOMAIN_LIST:
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