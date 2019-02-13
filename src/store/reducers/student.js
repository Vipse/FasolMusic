import * as actionTypes from '../actions/actionTypes'

const initialState = {
    myCoach: [],
    deadlinePay: {},
    trialTrainingForDisciplines: {},
    isTrialTrainingsAvailable: false,
    isTransferTrainPopupActive: true
};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.GET_DEADLINE_PAY: 
            return {
                ...state,
                deadlinePay: action.deadlinePay,
            }
        case actionTypes.MASTER_SCHEDULE:
            return {
                ...state,
                masterSchedule: Array.isArray(action.masterSchedule) ? {} : action.masterSchedule
            }
        case actionTypes.GET_USER_INFO:
            return {
                ...state,
                userInfo: action.userInfo
            } 
        case actionTypes.GET_AVAILABLE_INTERVAL:
            return {
                ...state,
                freeInterval: action.freeInterval
            }  
        case actionTypes.SET_WEEKDAYS_AND_DISCIPLINE_AND_ARRMASTERS:
            return {
                ...state,
                weekdays: action.weekdays,
                disciplineId: action.disciplineId,
                masters: action.masters
            }  
        case actionTypes.GET_FULL_INFO_MASTERS:
            return {
                ...state,
                fullInfoMasters: action.fullInfoMasters
            }  
        case actionTypes.GET_THE_MASTER_INTERVAL:
            return {
                ...state,
                theMasterInterval: action.theMasterInterval
            }
        case actionTypes.GET_TRAINING_TRIAL_STATUS:
            return {
                ...state,
                trialTrainingForDisciplines: {
                    ...state.trialTrainingForDisciplines,
                    [action.disciplineId]: action.status
                },
                isTrialTrainingsAvailable: state.isTrialTrainingsAvailable || !action.status
            }
        case actionTypes.RESET_TRAININGS_TRIAL_STATUS:
            return {
                ...state,
                isTrialTrainingsAvailable: false
            }
        case actionTypes.SET_TRANSFER_TRAIN_MODAL_INACTIVE:
            return {
                ...state,
                isTransferTrainPopupActive: false
            }
        case actionTypes.SET_IS_PUSH_BTN_TRANSFER:
            return {
                ...state,
                isPushBtnTransfer: !state.isPushBtnTransfer
            }  
        case actionTypes.SET_IS_PUSH_BTN_ADD:
            return {
                ...state,
                isPushBtnAdd: !state.isPushBtnAdd
            }    
        case actionTypes.SET_IS_PUSH_TRIAL_TRAINING:
            return {
                ...state,
                isPushBtnTrialTraining: action.isPushBtnTrialTraining
            } 
        case actionTypes.SET_NO_PUSH_BTN:
            return {
                ...state,
                isPushBtnAdd: action.isPushBtnAdd,
                isPushBtnTransfer: action.isPushBtnTransfer
            }     
        case actionTypes.GET_DISCIPLINE_COMMUNICATION:
            return {
                ...state,
                discCommunication: action.discCommunication
            }
        case actionTypes.SET_MASTER_THE_DISCIPLINE:
           
            return {
                ...state,
                selectMaster: action.selectMaster
            }
        case actionTypes.SET_DISC_ABONEMENT:
            return {
                ...state,
                discAbonement: action.discAbonement
            }
        case actionTypes.GET_USE_FROZEN_TRAINING:
            return {
                ...state,
                useFrozenTraining: action.useFrozenTraining
            }   
            
            

        default: return state;
    }
}

export default reducer;