

import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import moment from "moment";


export const autoLogin = (history) => {
    return (dispatch) => {

        const login = localStorage.getItem('_appdoc-user');
        const passw = localStorage.getItem('_appdoc-pass');

        if(login && passw){
            dispatch(login(login, passw, false, history, true));
        }
    }
}

export const getMasterList = (discipline = "") => {
    return dispatch => {
        const obj = {
            discipline
        }
        axios.post('/catalog.fasol/getMasterList',
            JSON.stringify(obj))
            .then(res => {
                //console.log('[setOnlineStatus] results',res)
            })
            .catch(err => {
                console.log('error: ',err);
            })
    }
}