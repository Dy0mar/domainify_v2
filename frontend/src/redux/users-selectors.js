import {createSelector} from "reselect";

export const getLastMessage = (state) => {
    return state.app.messages[state.app.messages.length-1];
};

export const getLastMessageID = createSelector(getLastMessage, (message) => {
    return message ? message.id : 1
});

export const newMessage = (state, type, msg) => {
    return {
        id: getLastMessageID(state),
        type: type,
        message: msg
    };
};

export const getUserListS = state => state.user.users.results;

export const getUserListPageTotalS = (state) => {
    return state.user.users.count
};

export const getCurrentUserS = (state) => {
    return {
        pk: state.user.pk,
        username: state.user.username,
        email: state.user.email,
        profile: state.profile,
        settings: state.settings
    }
};

export const getManagerListS = (state) => {
    let managers = state.user.managers.map(u => ({
        text: u[1],
        value: u[0],
        pk: u[0],
        username: u[1],
    }));
    const currentUser = state.user;
    if (currentUser.pk && managers.filter(u => u.pk === currentUser.pk ).length === 0){
        managers.push({
            text: currentUser.username,
            value: currentUser.pk,
            pk: currentUser.pk,
            username: currentUser.username,
        });
    }
    return managers
};