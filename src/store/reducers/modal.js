

import * as actionTypes from '../actions/actionTypes'
import moment from 'moment'

const initialState = {
    visible_ListTrainersModal: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type){

       
        case actionTypes.SHOW_LIST_TRAINERS_MODAL:
            return {
                ...state,
                visible_ListTrainersModal: true
            }
        case actionTypes.HIDE_LIST_TRAINERS_MODAL:
            return {
                ...state,
                visible_ListTrainersModal: false
            }

            
            
        default: return state;
    }
}

export default reducer;