const isDev = false
const apiRoute = 'https://api.nethackathon.org'
const devRoute = 'http://localhost:3000'
const route = (isDev) ? devRoute : apiRoute
const axios = require('axios');

export async function getTwitchSchedule () {
    const loginRoute = route + '/signup/schedule'
    return axios.get(loginRoute, {withCredentials: true})
}

export async function postTwitchSchedule (schedule) {
    const loginRoute = route + '/signup/schedule'
    return axios.post(loginRoute, schedule, {withCredentials: true})
}

export async function postTwitchText (discordUsername, notes) {
    const loginRoute = route + '/signup/text'
    return axios.post(loginRoute, {discordUsername, notes}, {withCredentials: true})
}

export async function getTwitchStreamers () {
    const streamersRoute = route + '/streamers'
    return axios.get(streamersRoute)
}

