import {readOnline, resetOnline, updateOnline} from "./annotate.online.service"
import {readOffline, resetOffline, updateOffline} from "./annotate.offline.service"

function isLoggedIn() {
    return (localStorage.getItem('nethackathon-jwt') !== null)
}

export async function update (data) {
    if (isLoggedIn()) {
        return await updateOnline(data)
    } else {
        return updateOffline(data)
    }
}

export async function read () {
    if (isLoggedIn()) {
        return readOnline()
    } else {
        return readOffline()
    }
}

export async function reset () {
    if (isLoggedIn()) {
        return resetOnline()
    } else {
        return resetOffline()
    }
}

