import * as actionTypes from '../actions/actionTypes'

const initialState = {
    myCoach: [],
    deadlinePay: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.GET_DEADLINE_PAY: 
            return {
                ...state,
                deadlinePay: action.deadlinePay,
            }
        case actionTypes.GET_MY_MASTERS:
            return {
                ...state,
                myCoach: action.myCoach
            }
        case actionTypes.MASTER_SCHEDULE:
            return {
                ...state,
                masterSchedule: Array.isArray(action.masterSchedule) ? {} : action.masterSchedule
            }
        case actionTypes.GET_USER_INFO:
            return {
                ...state,
                userInfo: action.userInfo
            } 
        case actionTypes.GET_AVAILABLE_INTERVAL:
            return {
                ...state,
                freeInterval: action.freeInterval
            }  
        case actionTypes.SET_WEEKDAYS_AND_DISCIPLINE_AND_ARRMASTERS:
            return {
                ...state,
                weekdays: action.weekdays,
                discipline: action.discipline,
                masters: action.masters
            }  
        case actionTypes.GET_FULL_INFO_MASTERS:
            return {
                ...state,
                fullInfoMasters: action.fullInfoMasters
            }  
        case actionTypes.GET_THE_MASTER_INTERVAL:
            return {
                ...state,
                theMasterInterval: action.theMasterInterval
            }  
            
            
        default: return state;
    }
}

export default reducer;