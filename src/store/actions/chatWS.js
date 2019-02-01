import * as actionTypes from './actionTypes';


export const setReceptionStatus = (isStart) => {
    return ({
        type: actionTypes.SET_RECEPTION_ISSTART,
        isStart,
    });
}

export const setIsCallingStatus = (isCalling) => {
    return ({
        type: actionTypes.SET_RECEPTION_ISCALLING,
        isCalling,
    });
}

export const setChatFromId = (id) => {
    return ({
        type: actionTypes.SET_CHAT_FROM_ID,
        id,
    });
}

export const setChatToId = (id) => {
    return ({
        type: actionTypes.SET_CHAT_TO_ID,
        id
    });
}

export const setChatInterlocutorInfo = (interlocutorName) => {
    return ({
        type: actionTypes.SET_CHAT_INTERLOCUTOR_INFO,
        interlocutorName
    });
}

export const setChatTrainingId = (idTraining) => {
    return ({
        type: actionTypes.SET_CHAT_TRAINING_ID,
        idTraining,
    });
}

export const setChatStory = (chat) => {
    return ({
        type: actionTypes.SET_CHAT_STORY,
        chat,
    });
}

export const setNewTimer = (timer) => {
    return ({
        type: actionTypes.SET_NEW_TIMER,
        timer,
    });
}