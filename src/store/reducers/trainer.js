import * as actionTypes from '../actions/actionTypes'

const initialState = {
    coachList : [],
};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.GET_MASTER_LIST:
            return {
                ...state,
                trainerList: action.trainerList,
            }

        default: return state;
        
    }
};

export default reducer;