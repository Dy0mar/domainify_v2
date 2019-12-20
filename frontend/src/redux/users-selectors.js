import {createSelector} from "reselect";

export const getLastMessage = (state) => {
    return state.app.messages[state.app.messages.length-1];
};

export const getLastMessageID = createSelector(getLastMessage, (message)=>{
    return message.id ? message.id : 1
});
