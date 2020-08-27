export const getCompanyListS = state => state.companies.results;

export const getCompanyByIdS = (state, companyId) => getCompanyListS(state).filter(item => item.pk === parseInt(companyId))[0];

export const getAbsoluteUrlOr404S = (url) => {
    return url ? '/'+url.split('api/')[1] : 'page404'
};