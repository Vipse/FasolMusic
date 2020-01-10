

import * as actionTypes from '../actions/actionTypes'
import moment from 'moment'

/*
    currentIdUser - one case when /app/schedule, one case when /app/schedule142762
    first - current user
    second - current user schedule page
*/

const initialState = {
    currentIdUser: null,
    listSchedule: {}, // list events
    listNewSchedule: {}, // clicked event that will be new schedule
    // {
    //     type: 'clicked_event'
    //     masterFio: string,
    //     idMaster: int
    //     start: timestamp
    // }
    freeInterval: [],
    masters: [], //list trainers for selecting
    fullInfoMasters: [],



    crossCurrentIdTraining: null,
    crossCurrendIdSubscription: null,
    crossCurrentIdTrialTraining: null, // for removing trial training

    clickedIdEvent: null, // for transfering or new schedule
    clickedTrainer: {
        id: null,
        name: null
    },


    timeClickFreeEvent: null, //timestamp of click on free block
    timeClickInAdminSchedule: null,

    pushBtnUnfresh: false, // is push btn
    pushBtnTrial: false, // is push btn
    pushBtnTransfer: false, // is push btn
};

const reducer = (state = initialState, action) => {
    switch (action.type) {


        case actionTypes.SET_PARAMS_ID:
            console.log("action", action)
            if (action.params.hasOwnProperty('pushBtnUnfresh')
                || action.params.hasOwnProperty('pushBtnTrial')
                || action.params.hasOwnProperty('pushBtnTransfer')) {

                return {
                    ...initialState,
                    ...action.params,
                    currentIdUser: state.currentIdUser,
                    listSchedule: state.listSchedule
                }
            }

            return {
                ...state,
                ...action.params
            }

        case actionTypes.GET_STUDENTS_SCHEDULE:
            return {
                ...state,
                listSchedule: action.listSchedule
            }
        case actionTypes.GET_TRAINER_TRAINING:
            return {
                ...state,
                listSchedule: action.listSchedule,
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
        case actionTypes.GET_FULL_INFO_MASTERS:
            return {
                ...state,
                fullInfoMasters: action.fullInfoMasters
            }
        default: return state;
    }
}

export default reducer;