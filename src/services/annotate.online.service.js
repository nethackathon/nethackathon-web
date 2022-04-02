const isDev = (process.env.NODE_ENV === 'development')
const apiRoute = 'https://api.nethackathon.org/annotate'
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

