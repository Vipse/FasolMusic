import * as actionTypes from '../actions/actionTypes'

let profileStudent = {};

const initialState = {...profileStudent};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.INFO_PATIENT:
            return {
                ...state,
                ...action.profileStudent
            };
        default: return state;
    }
};

export default reducer;
