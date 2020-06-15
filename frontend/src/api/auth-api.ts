import {authInstance, TErrors} from "./api";
import {TUser} from "../types/g-types";

type TLoginData = {
    token: string
    user: TUser
}
type TVerifyData = {
    token: string
}

export const authAPI = {
    me() {
        return authInstance.get<TUser>('auth/user/').then(r => r.data)
    },
    verify(token: string | null) {
        return authInstance.post<TVerifyData & TErrors>('api-token-verify/', {'token': token}).then(r => r.data)
    },
    login(username: string, password: string) {
        return authInstance.post<TLoginData>('auth/login/', {username, password}).then(r => r.data)
    },
    logout() {
        return authInstance.post('auth/logout/').then(r => r.data)
    },
}