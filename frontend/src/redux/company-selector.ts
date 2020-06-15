import {TAppState} from "./redux-store"

export const getCompanyListS = (state: TAppState) => state.companies.results

export const getCompanyByIdS = (state: TAppState, companyId: number) => getCompanyListS(state).filter(item => item.pk === companyId)[0]

export const getAbsoluteUrlOr404S = (url: string) => {
    return url ? '/'+url.split('api/')[1] : 'page404'
}