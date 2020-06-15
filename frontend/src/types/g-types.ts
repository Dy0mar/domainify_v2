export type TMessageTypes = 'success' | 'error'

export type TMessage = {
    id: number,
    type: TMessageTypes,
    message: string
}

export type TProfile = {
    jabber_nick: string
}

export type TSettings = {
    jabber: boolean
    email: boolean
}

export type TUser = {
    pk: number
    email: string
    username: string
    profile: TProfile | undefined
    settings: TSettings | undefined
}

export type TCompany = {
    pk: number
    name: string
    address: string
    url: string
}

export type TEmails = {
    pk: number,
    email: string
}

export type TTelephones = {
    pk: number,
    email: string
}

export type TDomain = {
    url: string
    pk: number
    name: string
    company: TCompany
    alexa_status: string
    emails: Array<TEmails>
    telephones: Array<TTelephones>
    alexa_comment: string
    redirect: string
    register_date: string
    expire_date: string
    status: string
    manager: TManager
    use_custom_address: false
    custom_company_address: string
    // executors: Array<number>
}

export type TUserList = {
    count: number
    next: null | string
    previous: null | string
    results: Array<TUser>
}

export type TManager = {
    pk: number
    username: string
    url: string
}

export type TStatuses = {
    pk: number
    status: string
    comment: string
}

export type TCreateCode = {
    code: string
    name: string
    comment: string
}

export type TCode = {pk: number} & TCreateCode

