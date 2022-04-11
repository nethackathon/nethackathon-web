const isDev = (process.env.NODE_ENV === 'development')
const apiRoute = 'https://api.nethackathon.org/streamer'
const devRoute = 'http://localhost:3000/streamer'
const baseRoute = (isDev) ? devRoute : apiRoute
const axios = require('axios');

export async function get () {
    const res = await axios.get(baseRoute, {withCredentials: true})
    return res.data
}

export async function getEggs () {
    const res = await axios.get(`${baseRoute}/eggs`, {withCredentials: true})
    return res.data
}

export async function updateAchievement (name) {
    const res = await axios.post(`${baseRoute}/achievement`, { name },  {withCredentials: true})
    return res.data
}

export async function update(data) {
    const res = await axios.post(baseRoute, data)
    return res.data
}

