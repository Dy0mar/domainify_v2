import axios, {AxiosRequestConfig} from "axios"
import {url} from './privacy'


const apiUrl = url+'api/'
const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
}

function setTokenInConfig (config: AxiosRequestConfig) {
    const token = localStorage.getItem("token")
    if (token)
        config.headers.Authorization = `Bearer ${token}`
    return config
}
// api instance
export const instance = axios.create({
    baseURL: apiUrl,
    headers: headers,
})

instance.interceptors.request.use(
  function (config) {return setTokenInConfig(config)},
  function (error) {return Promise.reject (error)}
)

// auth instance
export const authInstance = axios.create({
    baseURL: url,
    headers: headers,
})

authInstance.interceptors.request.use(
  function (config) {return setTokenInConfig(config)},
  function (error) {return Promise.reject (error)}
)

export type TResponseList<A = []> = {
    count: number
    next: null | string
    previous: null | string
    results: Array<A>
}

export type TErrors = {
    non_field_errors: string
}



