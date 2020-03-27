export type TMessageTypes = 'success' | 'error'

export type TMessage = {
    id: number,
    type: TMessageTypes,
    message: string
}