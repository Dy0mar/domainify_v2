import {usersAPI} from "../api/api";
import {login} from "./auth-reducer";

const SET_CURRENT_USER = 'user/SET_CURRENT_USER';


const initialSate = {
    pk: null,
    username: "",
    email: "",
    profile: {
        pidgin: ""
    },
    settings: null,
};


const userReducer = (state=initialSate, action) => {

    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                ...action.payload,
            };

        default: return state;
    }
};

export const setCurrentUserAction = (pk, username, email) => ({
    type: SET_CURRENT_USER,
    payload: {pk, username, email}
});


export const register = (username, email, password, pidgin) => async (dispatch) => {
    // todo: show error message
    const profile = {'profile': {
        'pidgin': pidgin,
    }};
    const response = await usersAPI.register(username, email, password, profile);

    if (response.status === 201){
        const pk = response.data.pk;
        dispatch(setCurrentUserAction(pk, username, email));
        dispatch(login(username, password));
    }
};

export const setCurrentUser = () => async (dispatch) => {

    const response = await usersAPI.me();

    if (response.status === 200){
        const {pk, username, email} = response.data;
        dispatch(setCurrentUserAction(pk, username, email));
    }
};

export const patchUserField = (pk, data) => async (dispatch) => {

    const response = await usersAPI.patch_field(pk, data);

    if (response.status === 200){

        const {id, username, email} = response.data;
        dispatch(setCurrentUserAction(id, username, email));
    }
};

export default userReducer;