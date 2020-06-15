import {instance, TResponseList} from "./api";
import {TDomain} from "../types/g-types";

export type TManager = {
    pk: number
    username: string
}

type TResponseManagerList = {
    list: Array<TManager>
}

export const domainsAPI = {
    create(data: TDomain) {
        return instance.post<TDomain>('domains/', {...data}).then(r => r.data)
    },
    delete(pk: number) {
        return instance.delete(`domains/${pk}/`).then(r => r.data)
    },
    domain_detail(pk: number) {
        return instance.get<TDomain>(`domains/${pk}/`).then(r => r.data)
    },
    patch_field(pk: number, data: TDomain) {
        return instance.patch<TDomain>(`domains/${pk}/`, {...data}).then(r => r.data)
    },
    // todo: refactor this
    domain_list(page: number, filters: any = []) {
        let url = `domains/?page=${page}`
        let part_url = convertObjectToUrl(filters)

        if (part_url !== '')
            url += part_url
        return instance.get<TResponseList<TDomain>>(url).then(r => r.data)
    },
    autocomplete_domain_list(term: string) {
        return instance.get<{list: Array<string>}>(`domains/search-domain-list/?term=${term}`).then(r => r.data)
    },
    status_list() {
        return instance.get('domains/status-list/').then(r => r.data)
    },
    alexa_status_list() {
        return instance.get('domains/alexa-status-list/').then(r => r.data)
    },
    manager_list() {
        return instance.get<TResponseManagerList>('domains/manager-list/').then(r => r.data)
    },
}

// todo: refactor this
export function convertObjectToUrl(objList: any) {
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
                url += separator + values.join(separator)
            }
        }
    })
    return url
}