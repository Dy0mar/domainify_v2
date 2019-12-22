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

// export const getUserJabberNickS = (state) => {
//     return state.user.jabber_nick
// }

export const getUserListS = (state) => {
    return state.user.users.results
    // return state.user.users.results.filter(u => u.pk !== state.user.pk)
};

export const getUserListPageTotalS = (state) => {
    return state.user.users.count
};
