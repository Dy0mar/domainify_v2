import {companyAPI} from "../api/api";
import {errorHandler} from "./app-reducer";

const SET_COMPANY_LIST = 'company/SET_COMPANY_LIST';

const initialSate = {
    count: 0,
    next: null,
    previous: null,
    companies: [{
            pk: 0,
            name: "",
            address: "",
            url: ""
        }],
    isLoading: true,
    formErrors: {},
    redirectTo: '',
};


const companyReducer = (state=initialSate, action) => {

    switch (action.type) {
        case SET_COMPANY_LIST:
            return {
                ...state,
                ...action.payload,
            };
        default: return state;
    }
};

// Actions
export const companyListAction = (results) => ({
    type: SET_COMPANY_LIST,
    payload: {results}
});


// Thunks
export const getCompanyList = () => async (dispatch) => {
    try{
        const response = await companyAPI.company_list();
        dispatch(companyListAction(response.data));
    } catch (e) {
        errorHandler(e, dispatch);
    }
};


export default companyReducer;