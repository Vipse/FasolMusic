import * as actionTypes from '../actions/actionTypes'

const initialState = {
    masterList: [],
};

const reducer = (state = initialState, action) => {
    
    switch (action.type){

        case actionTypes.GET_FREE_AND_BUSY_MASTER_LIST:
            return {
                ...state,
                masterList: action.masterList,
            }
        case actionTypes.GET_ALL_ADMIN_INFO_MASTERS_FREE:
            return {
                ...state,
                freetrainers: action.adminMasters,
            }
        case actionTypes.GET_ALL_ADMIN_INFO_MASTERS_BUSY:
            return {
                ...state,
                busytrainers: action.adminMasters,
            }
            
        default: return state;
    }
};

export default reducer;