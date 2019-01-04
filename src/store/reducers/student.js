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
            
            
        default: return state;
    }
}

export default reducer;