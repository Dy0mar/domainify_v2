import * as axios from "axios";



const instance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
});

instance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem("token");
        if (token)
            config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    function (error) {
        return Promise.reject (error);
    }
);


export const usersAPI = {
    register(username, email, password, profile) {
        return instance.post('users/', {username, email, password, profile})
    },
    me(){
        return instance.get('auth/user/')
    },
    patch_field(pk, data){
        return instance.patch(`users/${pk}/`, {...data})
    }

};


export const authAPI = {
    auth() {
        return instance.get('api-token-auth')
            .then(response => response.data)
    },

    verify() {
        return instance.post('api-token-verify/', {'token': localStorage.getItem("token")})
    },

    refresh() {
        return instance.get('api-token-refresh/')
            .then(response => response.data)
    },
    login(username, password) {
        return instance.post('auth/login/', {username, password})
            .then(response => response.data)
    },
    logout() {
        return instance.post('auth/logout/')
    },
};

