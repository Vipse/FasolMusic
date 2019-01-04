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
            
            
        default: return state;
    }
}

export default reducer;