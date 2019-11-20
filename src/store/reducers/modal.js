

import * as actionTypes from '../actions/actionTypes'
import moment from 'moment'

const initialState = {
    visible_ListTrainersModal: false,
    visible_TransferOrFreezeModal: false,

    visible_CreateTrainModal_Unfreeze: false,
    visible_CreateTrainModal_Trial: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type){

        //ListTrainersModal
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

        //TransferOrFreezeModal
        case actionTypes.SHOW_TRANSFER_OR_FREEZE_MODAL:
            return {
                ...state,
                visible_TransferOrFreezeModal: true
            }
        case actionTypes.HIDE_TRANSFER_OR_FREEZE_MODAL:
            return {
                ...state,
                visible_TransferOrFreezeModal: false
            }

        //CreateTrainModal
        case actionTypes.SHOW_CREATE_TRAIN_MODAL_CLICK_UNFREEZE:
            return {
                ...state,
                visible_CreateTrainModal_Unfreeze: true
            }
        case actionTypes.HIDE_CREATE_TRAIN_MODAL_CLICK_UNFREEZE:
            return {
                ...state,
                visible_CreateTrainModal_Unfreeze: false
            }

        case actionTypes.SHOW_CREATE_TRAIN_MODAL_CLICK_TRIAL:
            return {
                ...state,
                visible_CreateTrainModal_Trial: true
            }
        case actionTypes.HIDE_CREATE_TRAIN_MODAL_CLICK_TRIAL:
            return {
                ...state,
                visible_CreateTrainModal_Trial: false
            }

            //TransferOrNewScheduleModal
        case actionTypes.SHOW_TRANSFER_OR_NEW_SCHEDULE_MODAL:
            return {
                ...state,
                visible_TransferOrNewScheduleModal: true
            }
        case actionTypes.HIDE_TRANSFER_OR_NEW_SCHEDULE_MODAL:
            return {
                ...state,
                visible_TransferOrNewScheduleModal: false
            }

            
            
        default: return state;
    }
}

export default reducer;