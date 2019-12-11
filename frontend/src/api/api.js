import * as axios from "axios";


const token = localStorage.getItem("token");

const instance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
});

instance.defaults.headers.common['Authorization'] = token;


export const usersAPI = {
    register(username, email, password, pidgin) {
        return instance.post('users/', {username, email, password, pidgin})
            .then(response => response.data)
    },
};


export const authAPI = {
    auth() {
        return instance.get('api-token-auth')
            .then(response => response.data)
    },

    verify() {
        return instance.post('api-token-verify/', {token})
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

