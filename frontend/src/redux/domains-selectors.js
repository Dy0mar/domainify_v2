

export const getDomainListS = (state) => {
    return state.domains.results
};

export const getDomainListPageTotalS = (state) => {
    return state.domains.count
};

export const getUrlOr404S = (url) => {
    return url ? url.split('api/')[1] : 'page404'
};
