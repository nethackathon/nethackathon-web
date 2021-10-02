const isDev = true
const apiRoute = 'https://nethackathon.org/annotate'
const devRoute = 'http://localhost:3000/annotate'
const route = (isDev) ? devRoute : apiRoute
const axios = require('axios');
const token = localStorage.getItem('nethackathon-jwt')
if (token) {
    axios.defaults.headers.common['x-access-token'] = token
} else {
    delete axios.defaults.headers.common['x-access-token']
}


export async function updateOnline (data) {
    const res = await axios.post(route, data)
    return res.data
}

export async function readOnline () {
    const res = await axios.get(route)
    return res.data
}

export async function resetOnline () {
    const res = await axios.delete(route)
    return res.data
}

export async function register (data) {
    const registerRoute = route + '/register'
    const res = await axios.post(registerRoute, data)
    return res
}

export async function login (data) {
    const loginRoute = route + '/login'
    const res = await axios.post(loginRoute, data, {
        // We're handling errors by looking at the response status down the line
        validateStatus: function () {
            return true
        }
    })
    return res
}