import axios from './axiosSettings'
import * as actionTypes from './actionTypes';

export const setParamsId = (params) => { 
    return ({
        type: actionTypes.SET_PARAMS_ID,  
        params   
    });
}



