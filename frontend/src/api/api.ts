import axios from "axios"
import {url} from './privacy'
import {TProfile} from "../types/g-types"
import {TFormCompanyData} from "../types/company-types"


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
        return config
    },
    function (error) {
        return Promise.reject (error)
    }
)


export const usersAPI = {
    register(username: string, email: string, password: string, profile: TProfile) {
        return instance.post('users/', {username, email, password, profile})
    },
    patch_field(pk: number, data: any){
        return instance.patch(`users/${pk}/`, {...data}).then(r => r.data)
    },
    update_profile(pk: number, data: any){
        return instance.put(`users/${pk}/`, {...data})
    },
    get_user_list(page: number){
        return instance.get(`users/?page=${page}`).then(r => r.data)
    },
    get_all_user_list(){
        return instance.get(`users/all/`).then(r => r.data)
    },
    check_notification_method(m: 'jabber' | 'email'){
        return instance.get('users/check-notification-method/?method='+m)
    },
    manager_list(){
        return instance.get('users/manager-list/').then(r => r.data)
    }

}

export const domainsAPI = {
    create(data: any){
        return instance.post('domains/', {...data})
    },
    delete(pk: number){
        return instance.delete(`domains/${pk}/`)
    },
    domain_detail(pk: number){
        return instance.get(`domains/${pk}/`).then(r => r.data)
    },
    patch_field(pk: number, data: any){
        return instance.patch(`domains/${pk}/`, {...data})
    },
    domain_list(page: number, filters=[{}]){
        let url = `domains/?page=${page}`
        let part_url = convertObjectToUrl(filters)

        if (part_url !== '')
            url += part_url
        return instance.get(url).then(r => r.data)
    },
    autocomplete_domain_list(term: string){
        return instance.get(`domains/search-domain-list/?term=${term}`).then(r => r.data)
    },
    status_list(){
        return instance.get('domains/status-list/').then(r => r.data)
    },
    alexa_status_list(){
        return instance.get('domains/alexa-status-list/').then(r => r.data)
    },
    actualize_whois(pk: number){
        return instance.get('domains/actualize-whois/'+pk)
            .then(r => r.data)
            .catch(e => e.response.data)
    },
}


export const authAPI = {
    verify(token: string) {
        return instance.post('api-token-verify/', {'token': token})
            .then(r => r.data)
            .catch(e => e.response.data)
    },
    me() {
        return instance.get('auth/user/').then(r => r.data)
    },
    login(username: string, password: string) {
        return instance.post('auth/login/', {username, password})
            .then(r => r.data)
            .catch(e => e.response.data)
    },
    logout() {
        return instance.post('auth/logout/')
    },
}

export const companyAPI = {
    company_list(){
        return instance.get('companies/').then(r => r.data)
    },
    create(data: {name: string, address: string}){
        return instance.post('companies/', {...data})
            .then(r => r.data)
            .catch(e => {
                return {
                    ...e.response.data,
                    error: true
                }
            })
    },
    update(companyId: number, data: TFormCompanyData){
        return instance.put(`companies/${companyId}/`, {...data})
    },
    delete(pk: number){
        return instance.delete(`companies/${pk}/`)
    },
}

export const taskAPI = {
    task_list(page: number, filters=[{}]){
        let url = `tasks/?page=${page}`
        let part_url = convertObjectToUrl(filters)

        if (part_url !== '')
            url += part_url
        return instance.get(url)
    },
    create(data: any){
        return instance.post('tasks/', {...data})
            .then(r => r.data)
            .catch(e => {
                return {
                    ...e.response.data,
                    error: true
                }
            })
    },
    patch_field(pk: number, data: any){
        return instance.patch(`tasks/${pk}/`, {...data})
    },
    detail(pk: number){
        return instance.get(`tasks/${pk}/`)
    },
    delete(pk: number){
        return instance.delete(`tasks/${pk}/`)
    },
}

export const statusAPI = {
    status_list(){
        return instance.get('statuses/').then(r => r.data)
    },
    create(data: any){
        return instance.post('statuses/', {...data})
    },
    patch_field(pk: number, data: any){
        return instance.patch(`statuses/${pk}/`, {...data})
    },
    detail(pk: number){
        return instance.get(`statuses/${pk}/`)
    },
    delete(pk: number){
        return instance.delete(`statuses/${pk}/`)
    },
}

export const codesAPI = {
    codes_list(){
        return instance.get('codes/').then(r => r.data)
    },
    create(data: any){
        return instance.post('codes/', {...data})
    },
    patch_field(pk: number, data: any){
        return instance.patch(`codes/${pk}/`, {...data})
    },
    detail(pk: number){
        return instance.get(`codes/${pk}/`)
    },
    delete(pk: number){
        return instance.delete(`codes/${pk}/`)
    },
}



function convertObjectToUrl(objList: any) {
    // objList = [{param: ['value1', 'value2', ...]}, {...}]
    // to -> api/domains/?page=1&manager=9&manager=7
    if (objList.length === 0 && Object.entries(objList[0]).length === 0)
        return ''

    let url = ''
    objList.forEach((paramObj: any) => {
        let ss = Object.entries(paramObj)
        for (let [paramName, paramValues] of ss) {
            // @ts-ignore
            if (paramValues.length !== 0) {
                let separator = '&' + paramName + '='
                // @ts-ignore
                url += separator + paramValues.join(separator)
            }
        }
    })
    return url
}
