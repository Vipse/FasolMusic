

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
            
        default: return state;
    }
}

export default reducer;