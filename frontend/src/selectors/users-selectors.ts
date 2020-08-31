import {TAppState} from "../redux/redux-store"

export const getUserListS = (state: TAppState) => state.user.users.results

export const getUserPageSizeS = (state: TAppState) => state.user.users.page_size

export const getUserListPageTotalS = (state: TAppState) => {
    return state.user.users.count
}

export const getCurrentUserS = (state: TAppState) => {
    return {
        pk: state.user.pk,
        username: state.user.username,
        email: state.user.email,
        profile: state.user.profile,
        settings: state.user.settings
    }
}

type Manager = { pk: number, username: string }
type TFilter = { value: number, text: string }

export const getManagerListS = (state: TAppState): Array<Manager & TFilter> => {
    return state.user.managers.map((u: Manager) => ({
        value: u.pk,
        text: u.username,
        pk: u.pk,
        username: u.username,
    }))
}