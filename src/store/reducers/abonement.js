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
        },
        'fono':{
            ruText: 'Фортепиано',
            code: 144051,
            name: 'fono'
        }
    },

    disciplinesCode: [125470, 125485, 144051],
    weekInterval : null,
    studentBalance: 0,
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
            if(!Object.is(currDiscipline)){
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
        case actionTypes.GET_USER_FONO:
            return {
                ...state,
                toUserFono: action.toUserFono
            }
            
        default: return state;
    }
};

export default reducer;
