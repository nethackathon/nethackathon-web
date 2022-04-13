const isDev = (process.env.NODE_ENV === 'development')
const apiRoute = 'https://api.nethackathon.org'
const devRoute = 'http://localhost:3000'
const baseRoute = (isDev) ? devRoute : apiRoute
const axios = require('axios');

export async function getTwitchStreamers () {
    const route = baseRoute + '/streamers'
    return axios.get(route)
}

export async function getStreamersSchedule () {
    const route = baseRoute + '/streamers/schedule'
    return axios.get(route)
}

export async function getTagline () {
    const route = baseRoute + '/tagline'
    return axios.get(route)
}

export async function getLivelogs (lastlogs) {
    const qs = (lastlogs !== undefined) ? `?curtime=${lastlogs}` : ''
    return Promise.all([
      axios.get(`https://api.nethackathon.org/livelog${qs}`),
      axios.get(`https://eu.nethackathon.org/livelog${qs}`),
      axios.get(`https://au.nethackathon.org/livelog${qs}`)
    ])
}

export async function getEndedGames () {
    return Promise.all([
        axios.get(`https://api.nethackathon.org/endedGames`),
        axios.get(`https://eu.nethackathon.org/endedGames`),
        axios.get(`https://au.nethackathon.org/endedGames`)
    ])
}

export async function getSchedule () {
    const route = baseRoute + '/schedule'
    return axios.get(route)
}

