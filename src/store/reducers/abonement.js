import * as actionTypes from '../actions/actionTypes'

const initialState = {
    dataForCreate: {},
    currDiscipline: {
        ruText: 'Вокал',
        code: 125485
    },
    disciplines: {
        'guitar' : {
            ruText: 'Гитара',
            code: 125470,
            name: 'guitar'
        },
        'vocals' : {
            ruText: 'Вокал',
            code: 125485,
            name: 'vocals'
        }
    },
    weekInterval : null,
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
        case actionTypes.CHANGE_CURRENT_DISCIPLINE:
            return {
                ...state,
                currDiscipline: action.currDiscipline,
            } 
        case actionTypes.SET_WEEK_INTERVAL:
            return {
                ...state,
                weekInterval: action.weekInterval,
            }   
        case actionTypes.SET_CHOOSE_THE_MASTER_BY_STUDENT:
            return {
                ...state,
                chooseTheMaster: action.chooseTheMaster
            }
               
            
        default: return state;
    }
};

export default reducer;