import {Action, applyMiddleware, combineReducers, compose, createStore} from "redux"
import thunkMiddleware, {ThunkAction} from "redux-thunk"
import { createBrowserHistory } from 'history'
import { routerMiddleware, connectRouter } from 'connected-react-router'

import authReducer from "./auth-reducer"
import appReducer from "./app-reducer"
import userReducer from "./user-reducer"
import domainsReducer from "./domain-reducer"
import companyReducer from "./company-reducer"
import taskReducer from "./task-reducer"


// @ts-ignore
const composeEnhancers =  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const history = createBrowserHistory()

const CreateReducer = (history: any) => combineReducers({
    auth: authReducer,
    app: appReducer,
    user: userReducer,
    domains: domainsReducer,
    companies: companyReducer,
    tasks: taskReducer,
    router: connectRouter(history)
})

const rootReducer = CreateReducer(history)

const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(
            routerMiddleware(history),
            thunkMiddleware
        )
    )
)

export type TAppState = ReturnType<typeof rootReducer>
export type TInferActions<T> = T extends {[key: string]: (...args: any[]) => infer U } ? U : never
export type TBaseThunk<A extends Action, R = Promise<void>> = ThunkAction<R, TAppState, unknown, A>

export default store