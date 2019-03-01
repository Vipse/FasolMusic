import * as actionTypes from '../actions/actionTypes'

const initialState = {
    from: 0,
    to: 0,
    idTraining: 0,
    trainingStarts: false,
    isCalling: false,
    beginTime: 0,
    isComplete: true,
    isTrial: false,
    chatStory: [],
    conversationMode: 'video',
    timer: {
        s: 0,
        m: 0,
        h: 0,
    },
    interlocutorName: '',
    interlocutorAvatar: '',
    interlocutorStatus: 'offline'
};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.SET_RECEPTION_ISSTART:
            return {
                ...state,
                trainingStarts: action.isStart,
            }

        case actionTypes.SET_BEGIN_TIME:
            return {
                ...state,
                beginTime: action.beginTime,
            }
        case actionTypes.SET_RECEPTION_ISCOMPLETE:
            return {
                ...state,
                isComplete: action.isComplete,
            }
        case actionTypes.SET_RECEPTION_ISTRIAL:
            return {
                ...state,
                isTrial: action.isTrial,
            }
        case actionTypes.SET_RECEPTION_ISCALLING:
            return {
                ...state,
                isCalling: action.isCalling,
            }
        case actionTypes.SET_CHAT_FROM_ID:
            return {
                ...state,
                from: action.id,
            }
        case actionTypes.SET_CHAT_TO_ID:
            return {
                ...state,
                to: action.id
            }
            case actionTypes.SET_CHAT_INTERLOCUTOR_INFO:
            return {
                ...state,
                interlocutorName: action.interlocutorName,
                interlocutorAvatar: action.interlocutorAvatar
            }
        case actionTypes.SET_CHAT_TRAINING_ID:
            return {
                ...state,
                idTraining: action.idTraining,
            }
        case actionTypes.SET_CHAT_STORY:
            return {
                ...state,
                chatStory: action.chat,
            }
        case actionTypes.SET_CONVERSATION_MODE:
            return {
                ...state,
                conversationMode: action.mode,
            }
        case actionTypes.SET_NEW_TIMER:
            return {
                ...state,
                timer: action.timer,
            }
        case actionTypes.SET_INTERLOCUTOR_STATUS:
            return {
                ...state,
                interlocutorStatus: action.status,
            }

        default: return state;
    }
};

export default reducer;
