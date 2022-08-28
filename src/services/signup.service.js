const isDev = (process.env.NODE_ENV === 'development')
const apiRoute = 'https://api.nethackathon.org/signup'
const devRoute = 'http://localhost:3000/signup'
const baseRoute = (isDev) ? devRoute : apiRoute
const axios = require('axios');

export async function getTwitchSchedule () {
    return axios.get(baseRoute, {withCredentials: true})
}

export async function postTwitchSchedule (schedule) {
    const route = baseRoute + '/schedule'
    return axios.post(route, schedule, {withCredentials: true})
}

export async function postTwitchText (discordUsername, notes, pronouns) {
    const route = baseRoute + '/text'
    return axios.post(route, {discordUsername, notes, pronouns}, {withCredentials: true})
}

