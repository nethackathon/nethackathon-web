const isDev = (process.env.NODE_ENV === 'development')
const apiRoute = 'https://api.nethackathon.org/auth'
const devRoute = 'http://localhost:3000/auth'
const route = (isDev) ? devRoute : apiRoute
const axios = require('axios');
const token = localStorage.getItem('nethackathon-jwt')
if (token) {
    axios.defaults.headers.common['x-access-token'] = token
} else {
    delete axios.defaults.headers.common['x-access-token']
}

export async function register (data) {
    const registerRoute = route + '/register'
    const res = await axios.post(registerRoute, data)
    if (res.status === 201) {
        axios.defaults.headers.common['x-access-token'] = res.data
    }
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
    if (res.status === 201) {
        axios.defaults.headers.common['x-access-token'] = res.data
    }
    return res
}
