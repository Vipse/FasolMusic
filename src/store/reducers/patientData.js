import * as actionTypes from '../actions/actionTypes'

let profilePatient = {};

const initialState = {...profilePatient};

const reducer = (state = initialState, action) => {
    switch (action.type){
        // case actionTypes.SEND_NEW_INFO_DOCTOR:
        //     return {
        //         ...state
        //     };
        case actionTypes.INFO_PATIENT:
            return {
                ...state,
                ...action.profilePatient
            };

        case actionTypes.SEND_USER_POLE_VALUE:
            return {
                ...state,
                ["Patient" + action.pole]: action.value
            };

        case actionTypes.GET_USER_INFO_SHORT:
            return {
                ...state,
                ...action.userInfoShort
            };

        default: return state;
    }
};

export default reducer;