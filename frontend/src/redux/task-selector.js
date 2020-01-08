export const getTaskListS = state => state.tasks.results;
export const getCodeListS = state => state.tasks.codes;
export const getStatusListS = state => state.tasks.statuses;

export const getStatusByIdS = (state, statusId) => getStatusListS(state).filter(item => item.pk === parseInt(statusId))[0];

