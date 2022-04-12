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

export async function getLivelogUS () {
    const route = baseRoute + '/livelog'
    return axios.get(route)
}

export async function getLivelogEU () {
    const route = 'https://eu.nethackathon.org/livelog'
    return axios.get(route)
}

export async function getLivelogAU () {
    const route = 'https://au.nethackathon.org/livelog'
    return axios.get(route)
}

export async function getSchedule () {
    const route = baseRoute + '/schedule'
    return axios.get(route)
}

