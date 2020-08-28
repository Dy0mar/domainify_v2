import {TAppState} from "../redux/redux-store"
import {TCompany} from "../types/g-types"

export const getCompanyListS = (state: TAppState) => state.companies.results

export const getCompanyByIdS = (state:TAppState, companyId: number): TCompany =>
    state.companies.results[companyId]

export const getAbsoluteUrlOr404S = (url:string): string =>
    url ? '/' + url.split('api/')[1] : 'page404'
