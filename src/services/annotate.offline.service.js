const defaultData = {
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
    notes: '',
    cha: 10,
    touristCapShirt: false
}

export async function updateOffline (data) {
    localStorage.setItem('annotate', JSON.stringify(data))
    return data
}

export async function readOffline () {
    let localData = localStorage.getItem('annotate');
    if (localData === null) {
        localData = defaultData
        localStorage.setItem('annotate', JSON.stringify(localData))
    } else {
        localData = JSON.parse(localData)
    }
    return localData
}

export async function resetOffline () {
    localStorage.setItem('annotate', JSON.stringify(defaultData))
    return defaultData
}
