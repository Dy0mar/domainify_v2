import {login} from "./auth-reducer"
import {addSuccessMessage} from "./app-reducer"
import {usersAPI} from "../api/users-api"
import {authAPI} from "../api/auth-api";
import {domainsAPI} from "../api/domain-api";
import {TManager, TProfile, TSettings, TUser, TUserList} from "../types/g-types";
import {TBaseThunk, TInferActions} from "./redux-store";

const SET_CURRENT_USER = 'user/SET_CURRENT_USER'
const SET_USER_INFO = 'user/SET_CURRENT_USER'
const REGISTER_ERROR_MESSAGES = 'user/REGISTER_ERROR_MESSAGES'
const GET_USER_LIST = 'user/GET_USER_LIST'
const GET_MANAGER_LIST = 'user/GET_MANAGER_LIST'
const GET_FULL_USER_LIST = 'user/GET_FULL_USER_LIST'


const initialState = {
    pk: 0,
    username: '',
    email: '',
    profile: undefined as TProfile | undefined,
    settings: undefined as TSettings | undefined,
    registerErrors: {},
    users: {
        count: 0,
        next: 0,
        previous: 0,
        results: [] as Array<TUser>
    },
    managers: [] as Array<TManager>
}

type TInitialState = typeof initialState

const userReducer = (state=initialState, action: TActions): TInitialState => {

    switch (action.type) {
        case SET_CURRENT_USER:
        // // case SET_USER_INFO:
        // // case REGISTER_ERROR_MESSAGES:
        // // case GET_USER_LIST:
        // case GET_MANAGER_LIST:
            return {
                ...state,
                ...action.payload,
            }
        // case GET_FULL_USER_LIST:
        //     return {
        //         ...state,
        //         users: {
        //             ...state.users,
        //             results: [...state.users.results, ...action.users]
        //         }
        //     }
        default: return state
    }
}

// TYPES
export type TActions = TInferActions<typeof actions>

// ACTIONS
export const actions = {
    setCurrentUserAction: (pk: number, username: string, email: string, profile: TProfile | undefined, settings: TSettings | undefined) => ({
    type: SET_CURRENT_USER,
    payload: {pk: pk, username: username, email: email, profile: profile, settings: settings}
    } as const),

    userListAction: (users: Array<TUserList>) => ({
        type: GET_USER_LIST,
        payload: {users}
    } as const),

    // userFullListAction: (users: Array<TUser>) => ({
    //     type: GET_FULL_USER_LIST,
    //     users: users
    // } as const),

    managersListAction: (managers: Array<TUser>) => ({
        type: GET_MANAGER_LIST,
        payload: {managers}
    } as const),
}


// THUNKS
type TThunk = TBaseThunk<TActions>

export const getManagerList = (update=false): TThunk => async (dispatch, getState) => {
    //todo 291149: move to domain edit
    const managers = getState().user.managers
    if (!update && managers?.length !== 0)
        return
    const data = await domainsAPI.manager_list()
    dispatch(actions.managersListAction(data.list))
}

export const getUserList = (page=1): TThunk => async (dispatch) => {
    const data = await usersAPI.get_user_list(page)
    dispatch(actions.userListAction(data))
}

// export const getUserFullList = (): TThunk => async (dispatch) => {
//     dispatch(actions.userListAction({
//         count: 0,
//         next: 0,
//         previous: 0,
//         results: []
//     }))
//     let page = 1
//     do {
//         const data = await usersAPI.get_user_list(page)
//         dispatch(actions.userFullListAction(data.results))
//         data.next ? page++ : page=0
//     } while (page)
// }

export const register = (username: string, email: string, password: string, jabber_nick: string): TThunk => async (dispatch) => {
    const profile = {
        'jabber_nick': jabber_nick,
    }

    const data = await usersAPI.register(username, email, password, profile)
    const pk = data.pk
    // dispatch(actions.setCurrentUserAction(pk, username, email, profile))
    dispatch(login(username, password))
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
    const msg = Object.keys(data) + ' data was updated successfully'
    dispatch(addSuccessMessage(msg))
}

export const checkNotificationMethod = (method: string): TThunk => async (dispatch) => {
    const data = await usersAPI.check_notification_method(method)
    dispatch(addSuccessMessage(data))
}


export default userReducer