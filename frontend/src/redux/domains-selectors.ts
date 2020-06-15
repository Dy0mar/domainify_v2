import {TAppState} from "./redux-store";

export const getDomainListS = (state: TAppState) => state.domains.results;

export const getDomainDataSourceS = (state: TAppState) => state.domains.dataSource;

export const getDomainStatusListS = (state: TAppState) => (
    state.domains.statuses.map(u => ({text: u, value: u}))
);

export const getAlexaStatusListS = (state: TAppState) => (
    state.domains.alexa_statuses.map(u => ({text: u, value: u}))
);

export const getDomainListPageTotalS = (state: TAppState) => state.domains.count;

export const getUrlOr404S = (url: string) => {
    return url ? url.split('api/')[1] : 'page404'
};

export const getDomainIsLoadingS = (state: TAppState) => state.domains.isLoading;