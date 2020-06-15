import {convertObjectToUrl} from "./domain-api";
import {instance} from "./api";

export const taskAPI = {
    task_list(page: number, filters: any = []) {
        let url = `tasks/?page=${page}`
        let part_url = convertObjectToUrl(filters)

        if (part_url !== '')
            url += part_url
        return instance.get(url).then(r => r.data)
    },
    create(data: any) {
        return instance.post('tasks/', {...data}).then(r => r.data)
    },
    patch_field(pk: number, data: any) {
        return instance.patch(`tasks/${pk}/`, {...data}).then(r => r.data)
    },
    detail(pk: number) {
        return instance.get(`tasks/${pk}/`).then(r => r.data)
    },
    delete(pk: number) {
        return instance.delete(`tasks/${pk}/`).then(r => r.data)
    },
}