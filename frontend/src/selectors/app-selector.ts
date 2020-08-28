import {TAppState} from "../redux/redux-store"

export const getIsLoadingS = (state: TAppState): boolean => state.app.isLoading

export const getUrlOr404S = (url: string): string => {
    return  url ? '/' + url.split('api/')[1] : 'page404'
}