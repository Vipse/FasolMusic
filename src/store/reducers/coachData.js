import * as actionTypes from '../actions/actionTypes'

let profileCoach = {};

const initialState = profileCoach;

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.INFO_DOCTOR:
            return {
                ...action.profileCoach
            };
        case actionTypes.TRAINER_TRAININGS:
            return {
                ...state,
                trainerTrainings: action.trainerTrainings
            };

        default: return state;
    }
};

export default reducer;
