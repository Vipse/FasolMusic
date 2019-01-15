import * as actionTypes from '../actions/actionTypes'

const initialState = {
    dataForCreate: {},
    disciplines: {
        'guitar' : {
            ruText: 'гитара',
            code: 125470
        },
        'vocals' : {
            ruText: 'вокал',
            code: 125485
        }
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.CREATE_ABONEMENT:
            return {
                ...state,
                dataCreate: action.dataCreate,
            }
        case actionTypes.GET_ABONEMENTS:
            console.log('action :', action);
            return {
                ...state,
                allAbonements: action.allAbonements,
            }    
        case actionTypes.GET_ABONEMENTS2:
            return {
                ...state,
                allAbonements2: action.allAbonements2,
            }    
        default: return state;
    }
};

export default reducer;