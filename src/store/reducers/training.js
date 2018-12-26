

import * as actionTypes from '../actions/actionTypes'

const initialState = {
    nearTraining: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.GET_TRAINING_NOT_FINISHED: 
            return {
                ...state,
                nearTraining: action.nearTraining,
            }
            
        default: return state;
    }
}

export default reducer;