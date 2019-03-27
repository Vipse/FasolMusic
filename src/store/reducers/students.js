import * as actionTypes from '../actions/actionTypes'

const initialState = {
    coachStudents: [],
    availableAreaTime: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_RECEPTION:
            return {
                ...state,
                isReceptionRecorded: action.isReceptionRecorded,
                isRecordInProcess: false,
                receptionRecordedID: action.receptionRecordedID
            }
        case actionTypes.GET_NOT_PATIENT_DOCTORS:
            return {
                ...state,
                notPatientDoctors: action.notPatientDoctors,
            }
        case actionTypes.GET_PATIENT_DOCTORS:
            return {
                ...state,
                patientDoctors: action.patientDoctors,
                isLoadingPatientDoctors: false,

            }
        case actionTypes.GET_PATIENT_DOCTORS_SHORT:
            return {
                ...state,
                patientDoctorsShort: action.patientDoctors,
                isLoadingPatientDoctorsShort: false,
                myDoctorsLoaded: true
            }
        case actionTypes.GET_PATIENT_DOCTORS_LOADING:
            return {
                ...state,
                isLoadingPatientDoctors: true,
            }

        case actionTypes.SET_FREE_INTERVALS:
            return {
                ...state,
                freeIntervals: action.freeIntervals,
            }
        case actionTypes.SET_NEED_SAVE_INTERVALS:
            return {
                ...state,
                abonementIntervals: action.abonementIntervals,
                amountTraining: action.amountTraining
            }
        default: return state;
    }
}

export default reducer;
