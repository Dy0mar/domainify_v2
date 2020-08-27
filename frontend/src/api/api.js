import * as axios from "axios"
import {url} from './privacy'


const instance = axios.create({
    baseURL: url,
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
})

instance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem("token")
        if (token)
            config.headers.Authorization = `Bearer ${token}`
        return config;
    },
    function (error) {
        return Promise.reject (error);
    }
)


export const usersAPI = {
    register(username, email, password, profile) {
        return instance.post('users/', {username, email, password, profile})
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
    },
    check_notification_method(m){
        return instance.get('users/check-notification-method/?method='+m)
    }

}

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
    domain_list(page, filters=[]){
        let url = `domains/?page=${page}`;
        let part_url = convertObjectToUrl(filters);

        if (part_url !== '')
            url += part_url;
        return instance.get(url)
    },
    autocomplete_domain_list(term){
        return instance.get(`domains/autocomplete-domain-list/?term=${term}`)
    },
    status_list(){
        return instance.get('domains/status_list/')
    },
    alexa_status_list(){
        return instance.get('domains/alexa_status_list/')
    },
}


export const authAPI = {
    verify() {
        return instance.post('api-token-verify/', {'token': localStorage.getItem("token")})
    },
    me() {
        return instance.get('auth/user/').then(r => r.data)
    },
    login(username, password) {
        return instance.post('auth/login/', {username, password})
    },
    logout() {
        return instance.post('auth/logout/')
    },
}

export const companyAPI = {
    company_list(){
        return instance.get('companies/')
    },
    create(data){
        return instance.post('companies/', {...data})
    },
    patch_field(pk, data){
        return instance.patch(`companies/${pk}/`, {...data})
    },
    delete(pk){
        return instance.delete(`companies/${pk}/`)
    },
}

export const taskAPI = {
    task_list(page, filters=[]){
        let url = `tasks/?page=${page}`;
        let part_url = convertObjectToUrl(filters);

        if (part_url !== '')
            url += part_url;
        return instance.get(url)
    },
    create(data){
        return instance.post('tasks/', {...data})
    },
    patch_field(pk, data){
        return instance.patch(`tasks/${pk}/`, {...data})
    },
    detail(pk){
        return instance.get(`tasks/${pk}/`)
    },
    delete(pk){
        return instance.delete(`tasks/${pk}/`)
    },
}

export const statusAPI = {
    status_list(){
        return instance.get('statuses/')
    },
    create(data){
        return instance.post('statuses/', {...data})
    },
    patch_field(pk, data){
        return instance.patch(`statuses/${pk}/`, {...data})
    },
    detail(pk){
        return instance.get(`statuses/${pk}/`)
    },
    delete(pk){
        return instance.delete(`statuses/${pk}/`)
    },
}

export const codesAPI = {
    codes_list(){
        return instance.get('codes/')
    },
    create(data){
        return instance.post('codes/', {...data})
    },
    patch_field(pk, data){
        return instance.patch(`codes/${pk}/`, {...data})
    },
    detail(pk){
        return instance.get(`codes/${pk}/`)
    },
    delete(pk){
        return instance.delete(`codes/${pk}/`)
    },
}



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
