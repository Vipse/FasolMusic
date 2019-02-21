

import * as actionTypes from '../actions/actionTypes'

const initialState = {
    nearTraining: [],
    myCoachOrStudents: [],
    studentTrainings: []
};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.GET_TRAINING_NOT_FINISHED: 
            return {
                ...state,
                nearTraining: action.nearTraining,
            }
        case actionTypes.GET_NEXT_TRAINING: 
            return {
                ...state,
                nextTraining: action.nextTraining,
                nextTrainingTime: action.nextTrainingTime
            }
        case actionTypes.GET_MY_MASTERS_OR_STUDENTS: 
            return {
                ...state,
                myCoachOrStudents: action.myCoachOrStudents
            }
        case actionTypes.UNAUTHORIZED_TRIAL_DATA:
            return {
                ...state,
                unauthorizedTrialData: action.data
            }
        case actionTypes.GET_ALL_STUDENT_TRAININGS:
            return {
                ...state,
                studentTrainings: action.studentTrainings
            }
        case actionTypes.GET_TRIAL_FUTURE_TRAINING:
            return {
                ...state,
                futureTrialTraining: action.futureTrialTraining
            }
        case actionTypes.GET_COUNT_TRAINING_BY_DISCIPLINE:
            return {
                ...state,
                countTrainingDiscipline: action.countTrainingDiscipline
            }    
        case actionTypes.SAVE_NOTIFICATION:
            return {
                ...state,
                notifications: action.notifications
            }    
            
        default: return state;
    }
}

export default reducer;