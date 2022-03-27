const isDev = false
const apiRoute = 'https://api.nethackathon.org/annotate-api'
const devRoute = 'http://localhost:3000/annotate-api'
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
    if (res.status === 201) {
        axios.defaults.headers.common['x-access-token'] = res.data
    }
    return res
}

export async function updateSokoban (data) {
    const updateRoute = route + '/sokoban'
    const res = await axios.post(updateRoute, data)
    return res
}

export async function getBestTurns (level, sublevel) {
    const getRoute = `${route}/sokoban/turns/${level}/${sublevel}`
    const res = await axios.get(getRoute)
    return res
}

export async function getBestTime (level, sublevel) {
    const getRoute = `${route}/sokoban/time/${level}/${sublevel}`
    const res = await axios.get(getRoute)
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
