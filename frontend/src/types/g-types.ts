export type TMessageTypes = 'success' | 'error'

// APP
export type TMessage = {
    id: number,
    type: TMessageTypes,
    message: string
}

// USER
export type TUser = {
    pk: number
    email: string
    username: string
    profile: TProfile | undefined
    settings: TSettings | undefined
}

export type TProfile = {
    jabber_nick: string
}

export type TSettings = {
    jabber: boolean
    email: boolean
}

// COMPANY
export type TCompany = {
    pk: number
    name: string
    address: string
    url: string
}

// DOMAIN
export type TDomain = {
    url: string
    pk: number
    name: string
    company: TCompany
    emails: Array<TEmails>
    telephones: Array<TTelephones>
    redirect: string
    register_date: string
    expire_date: string
    status: string
    alexa_status: string
    alexa_comment: string
    manager: TManager & TUrl
    use_custom_address: boolean
    custom_company_address: string
}

export type TEmails = {
    pk: number,
    email: string
}

export type TTelephones = {
    pk: number,
    telephone: string
}

export type TManager = {
    pk: number
    username: string
}

type TUrl = {
    url: string
}