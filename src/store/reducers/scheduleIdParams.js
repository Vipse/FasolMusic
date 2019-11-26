

import * as actionTypes from '../actions/actionTypes'
import moment from 'moment'

/*
    currentIdUser - one case when /app/schedule, one case when /app/schedule142762
    first - current user
    second - current user schedule page
*/

const initialState = {
    currentIdUser: null,
    listNewSchedule: {}, // clicked event that will be new schedule
    // {
    //     type: 'clicked_event'
    //     masterFio: string,
    //     idMaster: int
    //     start: timestamp
    // }
    freeInterval: [],
    masters: [], //list trainers for selecting



    crossCurrentIdTraining: null,
    crossCurrendIdSubscription: null,

    clickedIdEvent: null, // for transfering or new schedule
    clickedTrainer: {
        id: null,
        name: null
    },

    timeClickFreeEvent: null, //timestamp of click on free block

    pushBtnUnfresh: false, // is push btn
    pushBtnTrial: false, // is push btn
};

const reducer = (state = initialState, action) => {
    switch (action.type) {


        case actionTypes.SET_PARAMS_ID:
            console.log("action", action)
            if (action.params.pushBtnUnfresh || action.params.pushBtnTrial) {
                return {
                    ...initialState,
                    ...action.params,
                    currentIdUser: state.currentIdUser
                }
            }

            return {
                ...state,
                ...action.params
            }


        case actionTypes.GET_AVAILABLE_INTERVAL:
            return {
                ...state,
                freeInterval: action.freeInterval
            }
        case actionTypes.GET_THE_MASTER_INTERVAL:
            return {
                ...state,
                freeInterval: action.freeInterval
            }
        case actionTypes.SET_WEEKDAYS_AND_DISCIPLINE_AND_ARRMASTERS:
            return {
                ...state,
                masters: action.masters
            }
        default: return state;
    }
}

export default reducer;