import * as actionTypes from '../actions/actionTypes'

let profileDoctor = {};

const initialState = profileDoctor;

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.INFO_DOCTOR:
            return {
                ...action.profileDoctor
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
