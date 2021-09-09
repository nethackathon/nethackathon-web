const apiRoute = 'http://nethackathon.org:3000'
const axios = require('axios');

export async function update (data) {
    const res = await axios.post(apiRoute + '/annotate', data)
    return res.data
}

export async function read () {
    const res = await axios.get(apiRoute + '/annotate')
    return res.data
}

export async function reset () {
    const res = await axios.delete(apiRoute + '/annotate')
    return res.data
}
