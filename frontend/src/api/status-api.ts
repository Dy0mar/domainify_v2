import {instance} from "./api";

export const statusAPI = {
    status_list() {
        return instance.get('statuses/').then(r => r.data)
    },
    create(data: any) {
        return instance.post('statuses/', {...data}).then(r => r.data)
    },
    patch_field(pk: number, data: any) {
        return instance.patch(`statuses/${pk}/`, {...data}).then(r => r.data)
    },
    detail(pk: number) {
        return instance.get(`statuses/${pk}/`).then(r => r.data)
    },
    delete(pk: number) {
        return instance.delete(`statuses/${pk}/`).then(r => r.data)
    },
}