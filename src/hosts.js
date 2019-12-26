export const listHost= {
    fasolStudio: 'web.fasolstudio.by',
    fasolOnline: 'web.fasolonline.ru'
}

export const url = listHost.fasolStudio // current host

export const baseURL = `https://${url}/~api/json/`


export const isFasolStudio = url === listHost.fasolStudio
export const isFasolOnline = url === listHost.fasolOnline