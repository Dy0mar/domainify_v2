import {applyMiddleware, combineReducers, compose, createStore} from "redux";

import authReducer from "./auth-reducer";
import appReducer from "./app-reducer";
import userReducer from "./user-reducer";
import domainsReducer from "./domain-reducer";
import companyReducer from "./company-reducer";
import thunkMiddleware from "redux-thunk";
import taskReducer from "./task-reducer";


// @ts-ignore
const composeEnhancers =  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const rootReducer = combineReducers({
    auth: authReducer,
    app: appReducer,
    user: userReducer,
    domains: domainsReducer,
    companies: companyReducer,
    tasks: taskReducer,
});

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware)));

type TRootReducer = typeof rootReducer
export type TAppState = ReturnType<TRootReducer>

export default store;