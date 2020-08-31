export type TMessageTypes = 'success' | 'error'

export type TProfile = {
    jabber_nick: string
}

export type TSettings = {
    jabber: boolean
    email: boolean
}

export type TMessage = {
    id: number,
    type: TMessageTypes,
    message: string
}

export type TCompany = {
    pk: number
    name: string
    address: string
    url: string
}