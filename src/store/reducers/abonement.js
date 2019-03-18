import * as actionTypes from '../actions/actionTypes'

const initialState = {
    dataForCreate: {},
    currDiscipline: {
        ruText: 'Вокал',
        code: 125485,
        name: 'vocals'
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
    
    disciplinesCode: [125470, 125485],
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
        
            let currDiscipline = action.currDiscipline;
            if(action.currDiscipline && typeof action.currDiscipline === 'string'){
                for(let elem in state.disciplines){
                    if(state.disciplines[elem].code == action.currDiscipline) currDiscipline = state.disciplines[elem]
                }
                
            }

            return {
                ...state,
                currDiscipline: {...currDiscipline},
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
        case actionTypes.GET_SUBSCRIPTION_FOR_DISCIPLINE:
            return {
                ...state,
                subsForDisc: action.subsForDisc
            }      
        case actionTypes.GET_STUDENT_BALANCE:
            return {
                ...state,
                studentBalance: action.studentBalance
            }    
        case actionTypes.IS_PUSH_BTN_UNFRESH:
            return {
                ...state,
                isPushBtnUnfresh: !state.isPushBtnUnfresh
            }    

        case actionTypes.CHANGE_PUSH_BTN_UNFRESH:
            return {
                ...state,
                isPushBtnUnfresh: action.isPushBtnUnfresh
            }
        default: return state;
    }
};

export default reducer;