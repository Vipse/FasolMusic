import * as actionTypes from '../actions/actionTypes'

const initialState = {
    trainerList : [],
};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.GET_MASTER_LIST:
            return {
                ...state,
                trainerList: action.trainerList,
            }
        case actionTypes.GET_TRAINER_TRAINING:
            return {
                ...state,
                trainerTraining: action.trainerTraining,
            }
            

        default: return state;
        
    }
};

export default reducer;