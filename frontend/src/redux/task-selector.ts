import {TAppState} from "./redux-store"

export const getTaskListS = (state: TAppState) => state.tasks.results
export const getCodeListS = (state: TAppState) => state.tasks.codes

export const getStatusListS = (state: TAppState) => {
    return state.tasks.statuses.map(item => ({
        ...item,
        value: item.pk,
        text: item.status,
    }))
}

export const getStatusByIdS = (state: TAppState, statusId: number) => getStatusListS(state).filter(item => item.pk === statusId)[0]

export const getTasksListPageTotalS = (state: TAppState) => state.tasks.count
