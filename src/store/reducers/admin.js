import * as actionTypes from '../actions/actionTypes'

const initialState = {
    freetrainers_listModal: [],
    busytrainers_listModal: [],

    masterList: {},
    reportLinks: {
        excelLink: '',
        htmlLink: ''
    }
};

const reducer = (state = initialState, action) => {
    
    switch (action.type){

        case actionTypes.GET_FREE_AND_BUSY_MASTER_LIST:
            return {
                ...state,
                masterList: action.masterList,
            }
        case actionTypes.GET_FREE_AND_BUSY_MASTER_LIST_ON_HOUR:
            return {
                ...state,
                freetrainers_listModal: action.freetrainers_listModal,
                busytrainers_listModal: action.busytrainers_listModal
            }

            
        // case actionTypes.GET_ALL_ADMIN_INFO_MASTERS_FREE:
        //     return {
        //         ...state,
        //         freetrainers: action.adminMasters,
        //     }
        // case actionTypes.GET_ALL_ADMIN_INFO_MASTERS_BUSY:
        //     return {
        //         ...state,
        //         busytrainers: action.adminMasters,
        //     }
        case actionTypes.GET_REPORT_LINKS:
            return {
                ...state,
                reportLinks: {
                    excelLink: action.excelLink,
                    htmlLink: action.htmlLink
                }
            }
        case actionTypes.GET_REPORT_REGISTRATION_LINKS:
            return {
                ...state,
                reportRegistrationLinks: {
                    excelLink: action.excelRegLink,
                    htmlLink: action.htmlRegLink
                }
            }
        case actionTypes.INFO_SCHEDULE_STUDENT:
            return {
                ...state,
                profileStudent: action.profileStudent,
            }
            
        default: return state;
    }
};

export default reducer;