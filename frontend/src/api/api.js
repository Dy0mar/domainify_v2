import * as axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json'
    },
});


export const usersAPI = {

};


export const authAPI = {
    auth() {
        return instance.get('api-token-auth')
            .then(response => response.data)
    },

    verify(token) {
        return instance.post('api-token-verify/', { token })
    },

    refresh() {
        return instance.get('api-token-refresh/')
            .then(response => response.data)
    },
    login(email, password) {
        return instance.post('auth/login/', {email, password})
            .then(response => response.data)
    },
    logout() {
        return instance.post('auth/logout/')
    }
};

