import * as actionTypes from '../actions/actionTypes'

const initialState = {
    isConfirmed: false,
    isReceived: false,
    visitId: 0,
    selectors: {},
    promoList: [],
    country: '',
    priceList: []
};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.LOADING_START:
            return {
                ...state,
                [action.loader]: true
            };
        case actionTypes.LOADING_END:
            return {
                ...state,
                [action.loader]: false
            };
        case actionTypes.DOC_EMERGANCY_RECEIVED_MARK:
            return {
                ...state,
                isReceived: false,
                visitId: 0,
            }
        case actionTypes.DOC_EMERGANCY_REQUEST_RECEIVED:
            return {
                ...state,
                isConfirmed: action.isConfirmed,
                visitId: action.visitId,
                isReceived: true,
            };
        case actionTypes.GET_SELECTORS:
            return {
                ...state,
                selectors: {...state.selectors, [action.selectorType]: action.values}
            };
        case actionTypes.GET_RESULTS_HEADER_SEARCH:
            return {
                ...state,
                usersHeaderSearch: action.usersHeaderSearch,
            };
        case actionTypes.GET_PROMO_LIST:
            return {
                ...state,
                promoList: action.promoList,
            };
        case actionTypes.GET_USER_COUNTRY:
            return {
                ...state,
                country: action.country,
            };
        case actionTypes.GET_ABONEMENTS_PRICE:
            return {
                ...state,
                priceList: action.priceList,
            };

        default:
            return state;

    }
};

export default reducer;
