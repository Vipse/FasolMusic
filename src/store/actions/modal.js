

import axios from './axiosSettings'
import * as actionTypes from './actionTypes';

export const showListTrainersModal = () => { 
    return ({
        type: actionTypes.SHOW_LIST_TRAINERS_MODAL,      
    });
}
export const hideListTrainersModal = () => { 
    return ({
        type: actionTypes.HIDE_LIST_TRAINERS_MODAL   
    });
}


