

import axios from './axiosSettings'
import * as actionTypes from './actionTypes';

export const showListTrainersModal = () => {
    return ({
        type: actionTypes.SHOW_LIST_TRAINERS_MODAL,
    });
}
export const hideListTrainersModal = () => {
    return ({
        type: actionTypes.HIDE_LIST_TRAINERS_MODAL
    });
}

export const showTransferOrFreezeModal = () => {
    return ({
        type: actionTypes.SHOW_TRANSFER_OR_FREEZE_MODAL,
    });
}
export const hideTransferOrFreezeModal = () => {
    return ({
        type: actionTypes.HIDE_TRANSFER_OR_FREEZE_MODAL
    });
}

//CreateTrainModal
export const showCreateTrainModal_clickUnfreeze = () => {
    return ({
        type: actionTypes.SHOW_CREATE_TRAIN_MODAL_CLICK_UNFREEZE,
    });
}
export const hideCreateTrainModal_clickUnfreeze = () => {
    return ({
        type: actionTypes.HIDE_CREATE_TRAIN_MODAL_CLICK_UNFREEZE
    });
}

export const showCreateTrainModal_clickTrial = () => {
    return ({
        type: actionTypes.SHOW_CREATE_TRAIN_MODAL_CLICK_TRIAL,
    });
}
export const hideCreateTrainModal_clickTrial = () => {
    return ({
        type: actionTypes.HIDE_CREATE_TRAIN_MODAL_CLICK_TRIAL
    });
}

//TransferOrNewScheduleModal

export const showTransferOrNewScheduleModal = () => {
    return ({
        type: actionTypes.SHOW_TRANSFER_OR_NEW_SCHEDULE_MODAL,
    });
}
export const hideTransferOrNewScheduleModal = () => {
    return ({
        type: actionTypes.HIDE_TRANSFER_OR_NEW_SCHEDULE_MODAL
    });
}

//RemoveTrialTrainingModal

export const showRemoveTrialTrainingModal = () => {
    return ({
        type: actionTypes.SHOW_REMOVE_TRIAL_TRAINING_MODAL,
    });
}
export const hideRemoveTrialTrainingModal = () => {
    return ({
        type: actionTypes.HIDE_REMOVE_TRIAL_TRAINING_MODAL
    });
}

//ConfirmCreateModal

export const showConfirmCreateModal = () => {
    return ({
        type: actionTypes.SHOW_CONFIRM_CREATE_MODAL,
    });
}
export const hideConfirmCreateModal = () => {
    return ({
        type: actionTypes.HIDE_CONFIRM_CREATE_MODAL
    });
}
