import {applyMiddleware, combineReducers, compose, createStore} from "redux";

import authReducer from "./auth-reducer";
import appReducer from "./app-reducer";
import userReducer from "./user-reducer";
import domainsReducer from "./domain-reducer";
import companyReducer from "./company-reducer";
import thunkMiddleware from "redux-thunk";


const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;


const reducers = combineReducers({
    auth: authReducer,
    app: appReducer,
    user: userReducer,
    domains: domainsReducer,
    companies: companyReducer,
});

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware)));


export default store;