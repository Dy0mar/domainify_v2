import {usersAPI, authAPI, domainsAPI} from "../api/api"
import {login} from "./auth-reducer"
import {
    TActions as TActionsApp,
    addSuccessMessage,
    commonAsyncHandler,
} from "./app-reducer"
import {TBaseThunk, TInferActions} from "./redux-store"
import {
    TManager,
    TPaginator,
    TProfile,
    TSettings,
    TUser
} from "../types/g-types"


const SET_CURRENT_USER = 'user/SET_CURRENT_USER'
const REGISTER_ERROR_MESSAGES = 'user/REGISTER_ERROR_MESSAGES'
const GET_USER_LIST = 'user/GET_USER_LIST'
const GET_MANAGER_LIST = 'user/GET_MANAGER_LIST'
const GET_FULL_USER_LIST = 'user/GET_FULL_USER_LIST'


// LOCAL TYPES
type TUsersPaginator = TPaginator<TUser>

type TRegisterErrors = {
    username: null | Array<string>,
    email: null |Array<string>,
    password: null |Array<string>,
    jabber_nick: null | Array<string>,
}


// STATE
const initialState = {
    pk: 0,
    username: "",
    email: "",
    profile: undefined as TProfile | undefined,
    settings: undefined as TSettings | undefined,
    registerErrors: {} as TRegisterErrors,
    users: {
        count: 0,
        next: null as string | null,
        previous: null as string | null,
        page_size: 10,
        results: [] as Array<TUser>
    } as TUsersPaginator,
    managers: [] as Array<TManager>
}

type TInitialState = typeof initialState

const userReducer = (state=initialState, action: TActions): TInitialState => {

    switch (action.type) {
        case SET_CURRENT_USER:
        case REGISTER_ERROR_MESSAGES:
        case GET_USER_LIST:
        case GET_MANAGER_LIST:
            return {
                ...state,
                ...action.payload,
            }
        case GET_FULL_USER_LIST:
            return {
                ...state,
                users: {
                    ...state.users,
                    results: [...action.users]
                }
            }
        default: return state
    }
}

// ACTIONS
export const actions = {
    setCurrentUserAction: (pk: number, username: string, email: string, profile: TProfile, settings: TSettings) => ({
        type: SET_CURRENT_USER,
        payload: {pk, username, email, profile, settings}
    } as const),

    registerErrorsAction: (registerErrors: TRegisterErrors) => ({
        type: REGISTER_ERROR_MESSAGES,
        payload: {registerErrors}
    } as const),

    userListAction: (users: TUsersPaginator) => ({
        type: GET_USER_LIST,
        payload: {users}
    } as const ),

    userFullListAction: (users: Array<TUser>) => ({
        type: GET_FULL_USER_LIST,
        users: users
    } as const),

    managersListAction: (managers: Array<TManager>) => ({
        type: GET_MANAGER_LIST,
        payload: {managers}
    } as const),
}


// THUNKS
export type TActions = TInferActions<typeof actions>
type TThunk = TBaseThunk<TActions | TActionsApp>

export const getManagerList = (update=false): TThunk => async (dispatch, getState) => {
    const managers = getState().user.managers
    if (!update && managers.length !== 0)
        return
    const data = await domainsAPI.manager_list()
    dispatch(actions.managersListAction(data.results))
}

export const getUserList = (page=1): TThunk => async (dispatch) => {
    await commonAsyncHandler( async () => {
        const data = await usersAPI.get_user_list(page)
        dispatch(actions.userListAction(data))
    }, dispatch)
}

export const getUserFullList = (): TThunk => async (dispatch) => {
    const data = await usersAPI.get_all_user_list()
    dispatch(actions.userFullListAction(data.results))
}

export const register = (username: string, email: string, password: string, jabber_nick: string): TThunk => async (dispatch) => {
    const profile = {
        'jabber_nick': jabber_nick,
    }
    try{
        const response = await usersAPI.register(username, email, password, profile)

        if (response.status === 201){
            const {pk, username, email, profile, settings} = response.data
            dispatch(actions.setCurrentUserAction(pk, username, email, profile, settings))
            await dispatch(login(username, password))
        }
    } catch (e) {
        if (e && e.response && e.response.data){
            const response = e.response
            const errors = response.data
            dispatch(actions.registerErrorsAction(errors))
        }
    }
}

export const setCurrentUser = (): TThunk => async (dispatch) => {
    const data = await authAPI.me()
    const {pk, username, email, profile, settings} = data
    dispatch(actions.setCurrentUserAction(pk, username, email, profile, settings))
}


export const updateUserProfile = (patch_data: any): TThunk => async (dispatch, getState) => {
    const user = getState().user
    const data = await usersAPI.patch_field(user.pk, {...patch_data})

    const {pk, username, email, profile, settings} = data
    dispatch(actions.setCurrentUserAction(pk, username, email, profile, settings))
    const msg = 'User updated successfully'
    await dispatch(addSuccessMessage(msg))
}

export const checkNotificationMethod = (method: 'jabber' | 'email'): TThunk => async (dispatch) => {
    const response = await usersAPI.check_notification_method(method)
    await dispatch(addSuccessMessage(response.data))
}


export default userReducer