const defaultServerData = {
    intrinsics: [
        { name: 'Cold', value: false },
        { name: 'Disintegration', value: false },
        { name: 'Fire', value: false },
        { name: 'Infravision', value: false },
        { name: 'Invisible', value: false },
        { name: 'Magic', value: false },
        { name: 'Poison', value: false },
        { name: 'Reflection', value: false },
        { name: 'Searching', value: false },
        { name: 'See Invisible', value: false },
        { name: 'Shock', value: false },
        { name: 'Sleep', value: false },
        { name: 'Speed', value: false },
        { name: 'Stealth', value: false },
        { name: 'Telepathy', value: false },
        { name: 'Teleport Control', value: false },
        { name: 'Teleportitis', value: false },
        { name: 'Warning', value: false },
    ],
    protection: 0,
    notes: ''
}

const serverData = Object.assign({}, defaultServerData)

export async function update (data) {
    Object.assign(data, serverData)
    return serverData
}

export async function read () {
    return serverData
}

