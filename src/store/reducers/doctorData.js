import * as actionTypes from '../actions/actionTypes'

let profileDoctor = {
    "id": "",
    "name": "",
    "avatar": "",
    "email": "",
    "country": "",
    "sex": "",
    "datebirth": "",
    "aboutme": "",
    "interests": [],
    "facebooklink": "",
    "googlelink": "",
    "promovideo": "",
    "improvetext": "",
    "disciplines": [],
    "best": "",
    "amountdays": "",
    "trainingtime": {},
    "active": "",
    "__nodeChanged": "",
    "phones": [],
    "work": "",
    "defaultPrice": ""
};

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
        case actionTypes.MASTER_SCHEDULE:
            return {
                ...state,
                masterSchedule: action.masterSchedule
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