export type TMessageTypes = 'success' | 'error'

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