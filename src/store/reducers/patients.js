import * as actionTypes from '../actions/actionTypes'

const initialState = {
    docPatients: [],
    notDocPatients: [],
    selectedPatientInfo:{},
    availableAreaTime: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.GET_DOCTORS_PATIENTS: 
            return {
                ...state,
                docPatients: action.patients,
            }
        case actionTypes.GET_NOT_DOCTORS_PATIENTS:
            return {
                ...state,
                notDocPatients: action.patients,
            }
        case actionTypes.GET_RESULTS_HEADER_SEARCH:
            return {
                ...state,
                usersHeaderSearch: action.usersHeaderSearch,
            }
        case actionTypes.GET_SELECTED_PATIENT_INFO:
            return {
                ...state,
                selectedPatientInfo: {
                    diseases: action.diseases,
                    treatments: action.treatments,
                    infoUser: action.infoUser,
                }
            }

        case actionTypes.GET_DATE_INTERVAL:
            return {
                ...state,
                intervals: action.intervals,
            }
        case actionTypes.GET_DATE_INTERVAL_WITHOUT_MAKING_APP:
            return {
                ...state,
                intervals: action.intervals,
            }
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
            }    
            
            
        default: return state;
    }
}

export default reducer;