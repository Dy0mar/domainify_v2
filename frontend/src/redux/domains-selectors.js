

export const getDomainListS = (state) => state.domains.results;

export const getDomainListPageTotalS = (state) => state.domains.count;

export const getUrlOr404S = (url) => {
    return url ? url.split('api/')[1] : 'page404'
};

export const getDomainIsLoadingS = (state) => state.domains.isLoading;