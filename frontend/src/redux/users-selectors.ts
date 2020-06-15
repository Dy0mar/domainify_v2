import {createSelector} from "reselect"
import {TAppState} from "./redux-store"

export const getLastMessage = (state: TAppState) => {
    return state.app.messages[state.app.messages.length-1]
}

export const getUserListS = (state: TAppState) => state.user.users.results

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

export const getManagerListS = (state: TAppState) => {
    let managers = state.user.managers.map(u => ({
        text: u.username,
        value: u.pk,
        pk: u.pk,
        username: u.username,
    }))
    const currentUser = state.user

    if (currentUser.pk && managers.filter(u => u.pk === currentUser.pk ).length === 0){
        managers.push({
            text: currentUser.username,
            value: currentUser.pk,
            pk: currentUser.pk,
            username: currentUser.username,
        })
    }
    return managers
}