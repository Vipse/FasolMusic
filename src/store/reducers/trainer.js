import * as actionTypes from '../actions/actionTypes'

const initialState = {
    trainerList : [],
    postTraining: {},
    futureTraining:{},
    todayTraining: {}
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
        case actionTypes.GET_POST_TRAINER_TRAINING:
            return {
             
                ...state,
                postTraining: action.postTraining,
            }
        case actionTypes.GET_FUTURE_TRAINER_TRAINING:
            return {
                ...state,
                futureTraining: action.futureTraining,
            }
        case actionTypes.GET_TODAY_TRAINER_TRAINING:
            return {
                ...state,
                todayTraining: action.todayTraining,
            }
        case actionTypes.GET_TRAINER_TRAINING_BY_TRAINER:
            return {
                ...state,
                eventTraining: action.eventTraining,
            }    
        case actionTypes.GET_MASTER_LIST_OBJ:
            return {
                ...state,
                masterListObj: action.masterListObj,
            }     
            
            

        default: return state;
        
    }
};

export default reducer;