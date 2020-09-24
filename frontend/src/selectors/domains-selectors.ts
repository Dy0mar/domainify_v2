import {TAppState} from "../redux/redux-store"

type ObjectList = { text: string, value: string }

export const getDomainListS = (state: TAppState) => state.domains.results

export const getCurrentDomainS = (state: TAppState) => state.domains.currentDomain

export const getDomainDataSourceS = (state: TAppState) => state.domains.dataSource

export const getDomainStatusListS = (state: TAppState): Array<ObjectList> =>
        state.domains.statuses.map((u: Array<string>) => ({text: u[0], value: u[1]}))

export const getAlexaStatusListS = (state: TAppState): Array<ObjectList> => (
    state.domains.alexa_statuses.map((u: Array<string>) => ({text: u[0], value: u[1]}))
)

export const getDomainListPageTotalS = (state: TAppState): number => state.domains.count
