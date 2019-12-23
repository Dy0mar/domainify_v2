import {domainsAPI} from "../api/api";

const GET_DOMAIN_LIST = 'domain/GET_DOMAIN_LIST';


const initialSate = {
    count: 0,
    next: null,
    previous: null,
    results: [{
        url: '',
        name: '',
        company_name: '',
        company_address: '',
        alexa_status: '',
        alexa_comment: '',
        redirect: '',
        register_date: '',
        expire_date: '',
        created_at: '',
        updated_at: '',
        status: '',
        manager: '',
    }]
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
export const domainListAction = ({count, next, previous, results}) => ({
    type: GET_DOMAIN_LIST,
    payload: {count, next, previous, results}
});


// Thunks
export const getDomainList = (page) => async (dispatch) => {
    const response = await domainsAPI.get_domain_list(page);
    if (response.status === 200) {
        dispatch(domainListAction(response.data));
    }
};

export default domainsReducer;