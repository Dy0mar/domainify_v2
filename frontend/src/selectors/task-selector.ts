import {TAppState} from "../redux/redux-store"

export const getTaskListS = (state: TAppState) => state.tasks.results
export const getCodeListS = (state: TAppState) => state.tasks.codes

type TStatusList = {
    pk: number
    comment: string
    status: string
    text: string
    value: number
}
export const getStatusListS = (state: TAppState): Array<TStatusList> => {
    return state.tasks.statuses.map((item: TStatusList) => {
        return {
        ...item,
        value: item.pk,
        text: item.status,
        }
    })
}

export const getTasksListPageTotalS = (state: TAppState): number => state.tasks.count
