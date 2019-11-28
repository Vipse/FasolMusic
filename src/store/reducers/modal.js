

import * as actionTypes from '../actions/actionTypes'
import moment from 'moment'

const initialState = {
    visible_ListTrainersModal: false,
    visible_TransferOrFreezeModal: false,

    visible_CreateTrainModal_Unfreeze: false,
    visible_CreateTrainModal_Trial: false,

    visible_TransferOrNewScheduleModal: false,

    visible_RemoveTrialTrainingModal: false,

    visible_ConfirmCreateModal: false
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

        //RemoveTrialTrainingModal
        case actionTypes.SHOW_REMOVE_TRIAL_TRAINING_MODAL:
            return {
                ...state,
                visible_RemoveTrialTrainingModal: true
            }
        case actionTypes.HIDE_REMOVE_TRIAL_TRAINING_MODAL:
            return {
                ...state,
                visible_RemoveTrialTrainingModal: false
            }

          
        //ConfirmCreateModal
        case actionTypes.SHOW_CONFIRM_CREATE_MODAL:
            return {
                ...state,
                visible_ConfirmCreateModal: true
            }
        case actionTypes.HIDE_CONFIRM_CREATE_MODAL:
            return {
                ...state,
                visible_ConfirmCreateModal: false
            }
                
            
        default: return state;
    }
}

export default reducer;