import * as actionTypes from './actionTypes';
import axios from "./axiosSettings";


export const setReceptionStatus = (isStart) => {
    return ({
        type: actionTypes.SET_RECEPTION_ISSTART,
        isStart,
    });
}

export const setBeginTime = (beginTime) => {
    return ({
        type: actionTypes.SET_BEGIN_TIME,
        beginTime,
    });
}

export const setIsCompleteStatus = (isComplete) => {
    return ({
        type: actionTypes.SET_RECEPTION_ISCOMPLETE,
        isComplete,
    });
}

export const setIsTrialStatus = (isTrial) => {
    return ({
        type: actionTypes.SET_RECEPTION_ISTRIAL,
        isTrial,
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

export const setChatInterlocutorInfo = (interlocutorName, interlocutorAvatar) => {
    return ({
        type: actionTypes.SET_CHAT_INTERLOCUTOR_INFO,
        interlocutorName,
        interlocutorAvatar
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

export const setConversationMode = (mode) => {
    return ({
        type: actionTypes.SET_CONVERSATION_MODE,
        mode
    })
}

export const setNewTimer = (timer) => {
    return ({
        type: actionTypes.SET_NEW_TIMER,
        timer,
    });
}

export const checkInterlocutorOnlineStatus = (id) => {
    return dispatch => {
        const newObj = {
            idUser: id,
        };

        axios.post('/catalog.fasol/userOnOff',
            JSON.stringify(newObj))
            .then(res => {
                dispatch({
                    type: actionTypes.SET_INTERLOCUTOR_STATUS,
                    status: res.data.status ? 'online' : 'offline'
                })
            })
            .catch(err => {
                console.log('error: ',err);
            })
    }
}
