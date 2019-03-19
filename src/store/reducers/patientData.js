import * as actionTypes from '../actions/actionTypes'

let profilePatient = {};

const initialState = {...profilePatient};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.INFO_PATIENT:
            return {
                ...state,
                ...action.profilePatient
            };
        default: return state;
    }
};

export default reducer;
