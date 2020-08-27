export const getDomainListS = (state) => state.domains.results;

export const getDomainDataSourceS = state => state.domains.dataSource;

export const getDomainStatusListS = (state) => (
    state.domains.statuses.map(u => ({text: u[0], value: u[1]}))
);

export const getAlexaStatusListS = (state) => (
    state.domains.alexa_statuses.map(u => ({text: u[0], value: u[1]}))
);

export const getDomainListPageTotalS = (state) => state.domains.count;

export const getUrlOr404S = (url) => {
    return url ? url.split('api/')[1] : 'page404'
};

export const getDomainIsLoadingS = (state) => state.domains.isLoading;