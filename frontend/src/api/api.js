import * as axios from "axios";



const instance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
});

instance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem("token");
        if (token)
            config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    function (error) {
        return Promise.reject (error);
    }
);


export const usersAPI = {
    register(username, email, password, profile) {
        return instance.post('users/', {username, email, password, profile})
    },
    me(){
        return instance.get('auth/user/')
    },
    get_user_info(pk){
        return instance.get(`users/${pk}/`)
    },
    patch_field(pk, data){
        return instance.patch(`users/${pk}/`, {...data})
    },
    update_profile(pk, data){
        return instance.put(`users/${pk}/`, {...data})
    },
    get_user_list(page){
        return instance.get(`users/?page=${page}`)
    },
    manager_list(){
        return instance.get('users/manager_list/')
    }
};

export const domainsAPI = {
    create(data){
        return instance.post('domains/', {...data})
    },
    delete(pk){
        return instance.delete(`domains/${pk}/`)
    },
    domain_detail(pk){
        return instance.get(`domains/${pk}/`)
    },
    patch_field(pk, data){
        return instance.patch(`domains/${pk}/`, {...data})
    },
    get_domain_list(page, filters=[]){
        let url = `domains/?page=${page}`;
        let part_url = convertObjectToUrl(filters);

        if (part_url !== '')
            url += part_url;
        return instance.get(url)
    },
    status_list(){
        return instance.get('domains/status_list/')
    },
    alexa_status_list(){
        return instance.get('domains/alexa_status_list/')
    },
    company_list(){
        return instance.get('domains/company_list/')
    },
};


export const authAPI = {
    auth() {
        return instance.get('api-token-auth')
            .then(response => response.data)
    },

    verify() {
        return instance.post('api-token-verify/', {'token': localStorage.getItem("token")})
    },

    refresh() {
        return instance.get('api-token-refresh/')
            .then(response => response.data)
    },
    login(username, password) {
        return instance.post('auth/login/', {username, password})
    },
    logout() {
        return instance.post('auth/logout/')
    },
};

export const companyAPI = {
    company_list(){
        return instance.get('companies/')
    },
};

function convertObjectToUrl(objList) {
    // objList = [{param: ['value1', 'value2', ...]}, {...}]
    if (objList.length === 0 && Object.entries(objList[0]).length === 0)
        return '';

    let url = '';
    objList.forEach(paramObj => {
        for (let [param, values] of Object.entries(paramObj)){
            if (values.length !== 0){
                let separator = '&' + param + '=';
                url += separator + values.join(separator);
            }
        }
    });
    return url
}
