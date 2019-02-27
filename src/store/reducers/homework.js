import * as actionTypes from '../actions/actionTypes'

const initialState = {
    trainings: [],
    loading: false,
    nextRequestNum: 0,
    maxAmountRequest: 10,
    isRequestFailed: false,
    endAchieved: false,
    search: ''
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_TRAINING_HISTORY_LIST_SUCCESS:
            return {
                ...state,
                trainings: [...state.trainings, ...action.trainingsArr],
                loading: false,
                nextRequestNum: state.nextRequestNum + 1,
                isRequestFailed: false,
                endAchieved: action.trainingsArr.length < state.maxAmountRequest
            };
        case actionTypes.GET_TRAINING_HISTORY_LIST_FAILED:
            return {
                ...state,
                loading: false,
                isRequestFailed: true
            };
        case actionTypes.SET_LOADING_STATUS:
            return {
                ...state,
                loading: action.status,
                search: action.search,
                nextRequestNum: action.search !== state.search ? 0 : state.nextRequestNum,
                trainings: action.search !== state.search ? [] : state.trainings
            };
        case actionTypes.CHANGE_MAX_AMOUNT:
            return {
                ...state,
                maxAmountRequest: action.amount
            };
        case actionTypes.RESET_TRAINING_HISTORY_LIST:
            return {
                ...initialState
            };
        default: return state;
    }
};

export default reducer;
