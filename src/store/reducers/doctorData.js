import * as actionTypes from '../actions/actionTypes'

let profileDoctor = {};

const initialState = profileDoctor;

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.SEND_NEW_INFO_DOCTOR:
            return {
                ...state
            };
        case actionTypes.INFO_DOCTOR:
            return {
                ...state,
                ...action.profileDoctor
            };
        case actionTypes.TRAINER_TRAININGS:
            return {
                ...state,
                trainerTrainings: action.trainerTrainings
            };
        case actionTypes.GET_ALL_DOC_INTERVALS:
            return {
                ...state,
                workIntervals: action.intervalsDoctor
            };
        case actionTypes.DOC_INTERVALS_WITH_APPS_ALL:
            return {
                ...state,
                docIntervalsWithAppsAll: action.intervals
            };

        default: return state;
    }
};

export default reducer;