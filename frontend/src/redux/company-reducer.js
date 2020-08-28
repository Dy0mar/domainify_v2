import {companyAPI} from "../api/api";
import {
    addSuccessMessage,
    commonAsyncHandler,
    errorHandler
} from "./app-reducer";
import {actions as appActions} from './app-reducer'
const SET_COMPANY_LIST = 'company/SET_COMPANY_LIST';
const SET_FORM_ERROR_MESSAGES = 'company/SET_FORM_ERROR_MESSAGES';

const initialState = {
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


const companyReducer = (state=initialState, action) => {

    switch (action.type) {
        case SET_COMPANY_LIST:
        case SET_FORM_ERROR_MESSAGES:
            return {
                ...state,
                ...action.payload,
            };
        default: return state;
    }
};

// ACTIONS
export const companyListAction = (results) => ({
    type: SET_COMPANY_LIST,
    payload: {results}
});


export const setFormErrorsAction = (formErrors) => ({
    type: SET_FORM_ERROR_MESSAGES,
    payload: {formErrors}
});


// THUNKS
export const getCompanyList = () => async (dispatch) => {
    await commonAsyncHandler(async () => {
        const data = await companyAPI.company_list();
        dispatch(companyListAction(data));
    }, dispatch)
};

export const createCompany = (data) => async (dispatch) => {
    try{
        const response = await companyAPI.create(data);
        if (response.status === 201){
            dispatch(addSuccessMessage('Company has been created'));
            dispatch(appActions.redirectToAction('/companies'));
            dispatch(setFormErrorsAction({}));
        }
    } catch (e) {
        const response = e.response;
        const errors = response.data;
        dispatch(setFormErrorsAction(errors))
    }
};

export const updateCompany = (data) => async (dispatch) => {
    try{
        await companyAPI.patch_field(data.pk, {...data});
        const msg = data.name + ' data was updated successfully';
        dispatch(addSuccessMessage(msg));
        dispatch(appActions.redirectToAction('/companies'));
        dispatch(setFormErrorsAction({}))
    } catch (e) {
        const response = e.response;
        const errors = response.data;
        dispatch(setFormErrorsAction(errors))
    }
};

export const deleteCompany = (pk) => async (dispatch) => {
    try{
        await companyAPI.delete(pk);
        const msg = 'Company has been deleted';
        dispatch(addSuccessMessage(msg));
        dispatch(getCompanyList());
        dispatch(setFormErrorsAction({}))
    } catch (e) {
        errorHandler(e, dispatch);
    }
};

export default companyReducer;