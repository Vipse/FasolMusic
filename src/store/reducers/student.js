import * as actionTypes from '../actions/actionTypes'

const initialState = {
       //
      // freeInterval: [], //the main interval
      // masters: [], //unfreeze and trial schedule
       listSchedule: {},
       fullInfoMasters: [], // list of masters for selecting

       isPushBtnTransfer: false, //SET_PARAMS_STATUS_PUSH
       isPushBtnUnfresh: false, //SET_PARAMS_STATUS_PUSH
       isPushBtnTrialTraining: false, //SET_PARAMS_STATUS_PUSH


       //
    myCoach: [],
    deadlinePay: {},
    trialTrainingForDisciplines: {},
    isTrialTrainingsAvailableCount: 0,
    isTransferTrainPopupActive: true,
    statusBtnBack: false,
    
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
       


      
        case actionTypes.GET_TRAINING_TRIAL_STATUS:
            return {
                ...state,
                trialTrainingForDisciplines: {
                    ...state.trialTrainingForDisciplines,
                    [action.disciplineId]: action.status
                }
            }
        case actionTypes.SET_TRAININGS_AVAILABLE_STATUS:
            return {
                ...state,
                isTrialTrainingsAvailableCount: action.isTrialTrainingsAvailableCount
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



            case actionTypes.SET_PARAMS_STATUS_PUSH:
                return {
                    ...state,
                    ...action.params
                }

        case actionTypes.CHANGE_PUSH_BTN_TRANSFER:
            return {
                ...state,
                isPushBtnTransfer: action.isPushBtnTransfer
            }
        case actionTypes.SET_IS_PUSH_BTN_TRANSFER:
            return {
                ...state,
                isPushBtnTransfer: !state.isPushBtnTransfer
            }
        case actionTypes.UNSET_IS_PUSH_BTN_TRANSFER:

            return {
                ...state,
                isPushBtnTransfer: action.isPushBtnTransfer
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
        case actionTypes.CHANGE_BTN_BACK:
            return {
                ...state,
                statusBtnBack: action.statusBtnBack
            }




        default: return state;
    }
}

export default reducer;
