import {TAppState} from "../redux/redux-store"
import {TCompany} from "../types/g-types"

export const getCompanyListS = (state: TAppState) => state.companies.results

export const getCompanyListPageTotalS = (state: TAppState) => state.companies.count

export const getCompanyListPageSizeS = (state: TAppState) => state.companies.page_size


export const getCompanyByIdS = (state:TAppState, companyId: number): TCompany =>
    state.companies.results[companyId]
