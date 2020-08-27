export const getTaskListS = state => state.tasks.results;
export const getCodeListS = state => state.tasks.codes;
export const getStatusListS = state => {
    return state.tasks.statuses.map(item => ({
        ...item,
        value: item.pk,
        text: item.status,
    }));
};

export const getStatusByIdS = (state, statusId) => getStatusListS(state).filter(item => item.pk === parseInt(statusId))[0];

export const getTasksListPageTotalS = (state) => state.tasks.count;
