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
            
        default: return state;
    }
}

export default reducer;