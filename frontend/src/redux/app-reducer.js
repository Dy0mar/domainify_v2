import {verifyToken} from "./auth-reducer";

const INITIALIZED_SUCCESS = 'app/INITIALIZED_SUCCESS';


const initialSate = {
    initialized: false
};


const appReducer = (state=initialSate, action) => {

    switch (action.type) {
        case INITIALIZED_SUCCESS:
            return {
                ...state,
                initialized: true,
            };

        default: return state;
    }
};


export const initializedSuccess = () => ({
    type: INITIALIZED_SUCCESS,
});


export const initializeApp = () => (dispatch) => {
    const token = localStorage.token;
    const verifyTokenPromise = token
        ? dispatch(verifyToken())
        : new Promise((resolve, reject) => resolve(1));


    Promise.all([verifyTokenPromise]).then(() => {
        dispatch(initializedSuccess());
    });

};


export default appReducer;