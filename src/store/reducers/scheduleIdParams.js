

import * as actionTypes from '../actions/actionTypes'
import moment from 'moment'

/*
    currentIdUser - one case when /app/schedule, one case when /app/schedule142762
    first - current user
    second - current user schedule page
*/

const initialState = {
    currentIdUser: null,
    
    crossCurrentIdTraining: null,
    crossCurrendIdSubscription: null,

    clickedIdEvent: null, // for transfer or new schedule

    timeClickFreeEvent: null, //timestamp of click on free block
};

const reducer = (state = initialState, action) => {
    switch (action.type){

        case actionTypes.SET_PARAMS_ID:
            return {
                ...state,
                ...action.params
            }
      
        default: return state;
    }
}

export default reducer;