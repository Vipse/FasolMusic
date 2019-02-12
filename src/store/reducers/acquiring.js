import * as actionTypes from '../actions/actionTypes'

const initialState = {
};

const reducer = (state = initialState, action) => {
    
    switch (action.type){

        case actionTypes.GET_TOKEN:
            return {
                ...state,
                token: action.token,
                redirect_url: action.redirect_url
            }
        case actionTypes.CHECK_TOKEN:
            return {
                ...state,
                checkToken: action.checkToken,
            }
                
        default: return state;
    }
};

export default reducer;