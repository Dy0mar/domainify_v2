import {TAppState} from "../redux/redux-store"

export const getLastMessage = (state: TAppState) => {
    return state.app.messages[state.app.messages.length-1]
}

export const getIsLoadingS = (state: TAppState): boolean => state.app.isLoading

export const getUrlOr404S = (url: string): string => {
    return  url ? '/' + url.split('api/')[1] : 'page404'
}

export const isInitializedS = (state: TAppState): boolean => state.app.initialized