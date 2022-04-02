const isDev = (process.env.NODE_ENV === 'development')
const apiRoute = 'https://api.nethackathon.org/sokoban'
const devRoute = 'http://localhost:3000/sokoban'
const route = (isDev) ? devRoute : apiRoute
const axios = require('axios');
const token = localStorage.getItem('nethackathon-jwt')
if (token) {
    axios.defaults.headers.common['x-access-token'] = token
} else {
    delete axios.defaults.headers.common['x-access-token']
}


export async function updateSokoban (data) {
    const res = await axios.post(route, data)
    return res
}

export async function getBestTurns (level, sublevel) {
    const getRoute = `${route}/turns/${level}/${sublevel}`
    const res = await axios.get(getRoute)
    return res
}

export async function getBestTime (level, sublevel) {
    const getRoute = `${route}/time/${level}/${sublevel}`
    const res = await axios.get(getRoute)
    return res
}
