import {instance} from "./api";
import {TCode, TCreateCode} from "../types/g-types";

export const codesAPI = {
    codes_list() {
        return instance.get<Array<TCode>>('codes/').then(r => r.data)
    },
    create(data: TCreateCode) {
        debugger
        return instance.post('codes/', {...data}).then(r => r.data)
    },
    patch_field(pk: number, data: any) {
        return instance.patch(`codes/${pk}/`, {...data}).then(r => r.data)
    },
    detail(pk: number) {
        return instance.get(`codes/${pk}/`).then(r => r.data)
    },
    delete(pk: number) {
        return instance.delete(`codes/${pk}/`).then(r => r.data)
    },
}