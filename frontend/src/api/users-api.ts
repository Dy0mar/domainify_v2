import {instance} from "./api"
import {TProfile, TSettings, TUser, TUserList} from "../types/g-types"

export const usersAPI = {
    register(username: string, email: string, password: string, profile: TProfile) {
        return instance.post<TUser>('users/', {username, email, password, profile})
            .then(r => r.data)
    },
    get_user_info(pk: number) {
        return instance.get<TProfile | TSettings>(`users/${pk}/`)
            .then(r => r.data)
    },
    patch_field(pk: number, data: TUser) {
        return instance.patch<TUser>(`users/${pk}/`, {...data})
            .then(r => r.data)
    },
    update_profile(pk: number, data: TUser) {
        return instance.put<TUser>(`users/${pk}/`, {...data})
            .then(r => r.data)
    },
    get_user_list(page: number) {
        return instance.get<Array<TUserList>>(`users/?page=${page}`)
            .then(r => r.data)
    },
    check_notification_method(m: string) {
        return instance.get<string>('users/check-notification-method/?method=' + m)
            .then(r => r.data)
    }
}