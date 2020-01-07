import {companyAPI} from "../api/api";
import {
    addSuccessMessage,
    errorHandler,
    redirectToAction,
    setLoadingAction
} from "./app-reducer";

const SET_COMPANY_LIST = 'company/SET_COMPANY_LIST';
const SET_LOADING = 'company/SET_LOADING';
const SET_FORM_ERROR_MESSAGES = 'company/SET_FORM_ERROR_MESSAGES';

const initialSate = {
    count: 0,
    next: null,
    previous: null,
    results: [{
            pk: 0,
            name: "",
            address: "",
            url: ""
        }],
    formErrors: {},
};


const companyReducer = (state=initialSate, action) => {

    switch (action.type) {
        case SET_COMPANY_LIST:
        case SET_LOADING:
        case SET_FORM_ERROR_MESSAGES:
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


export const setFormErrorsAction = (formErrors) => ({
    type: SET_FORM_ERROR_MESSAGES,
    payload: {formErrors}
});


// Thunks
export const getCompanyList = () => async (dispatch) => {
    dispatch(setLoadingAction(true));
    try{
        const response = await companyAPI.company_list();
        dispatch(companyListAction(response.data));
    } catch (e) {
        errorHandler(e, dispatch);
    } finally {
        dispatch(setLoadingAction(false));
    }
};

export const updateCompany = (data) => async (dispatch) => {
    try{
        await companyAPI.patch_field(data.pk, {...data});
        dispatch(getCompanyList());
        const msg = data.name + ' data was updated successfully';
        dispatch(addSuccessMessage(msg));
        dispatch(redirectToAction('/companies/'));
        dispatch(setFormErrorsAction({}))
    } catch (e) {
        const response = e.response;
        const errors = response.data;
        dispatch(setFormErrorsAction(errors))
    }
};


export default companyReducer;