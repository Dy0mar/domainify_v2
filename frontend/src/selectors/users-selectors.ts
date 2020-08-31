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

type Manager = {
    value: number,
    text: string,
    pk: number,
    username: string
}
export const getManagerListS = (state: TAppState): Array<Manager> => {
    let managers = state.user.managers.map((u: Array<(string|number)>) => ({
        value: u[0],
        text: u[1],
        pk: u[0],
        username: u[1],
    }))
    const currentUser = state.user
    // if current user is not in the manager list - add one
    if (currentUser.pk && managers.filter((u: Manager) => u.pk === currentUser.pk ).length === 0){
        managers.push({
            text: currentUser.username,
            value: currentUser.pk,
            pk: currentUser.pk,
            username: currentUser.username,
        })
    }
    return managers
}