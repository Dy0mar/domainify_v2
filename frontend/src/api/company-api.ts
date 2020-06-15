import {instance} from "./api";
import {TCompany} from "../types/g-types";

export const companyAPI = {
    company_list() {
        return instance.get<TCompany>('companies/').then(r => r.data)
    },
    create(data: any) {
        return instance.post('companies/', {...data}).then(r => r.data)
    },
    patch_field(pk: number, data: any) {
        return instance.patch(`companies/${pk}/`, {...data}).then(r => r.data)
    },
    delete(pk: number) {
        return instance.delete(`companies/${pk}/`).then(r => r.data)
    },
}