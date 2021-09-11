const apiRoute = 'https://nethackathon.org/annotate'
const axios = require('axios');

export async function update (data) {
    const res = await axios.post(apiRoute, data)
    return res.data
}

export async function read () {
    const res = await axios.get(apiRoute)
    return res.data
}

export async function reset () {
    const res = await axios.delete(apiRoute)
    return res.data
}
