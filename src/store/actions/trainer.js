

import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import moment from "moment";
import { dateMath } from 'date-arithmetic';


export const autoLogin = (history) => {
    return (dispatch) => {

        const login = localStorage.getItem('_fasol-user');
        const passw = localStorage.getItem('_fasol-pass');

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
                dispatch({
                    type: actionTypes.GET_MASTER_LIST,
                    trainerList: res.data.result.masterlist,
                })
            })
            .catch(err => {
                console.log('error: ',err);
            })
    }
}

export const getTrainerTraining = (dateMin, dateMax) => {
    return dispatch => {
        const obj = {
            dateMin,
            dateMax
        }

        console.log("getTrainerTraining", obj)
        axios.post('/catalog.fasol/getTrainerTraining',
            JSON.stringify(obj))
            .then(res => {
                console.log("REEES", res.data.result)
                dispatch({
                    type: actionTypes.GET_TRAINER_TRAINING,
                    trainerTraining: res.data.result.result,
                })
            })
            .catch(err => {
                console.log('error: ',err);
            })
    }
}


export const getPostTrainerTraining = (idMaster, dateMin, dateMax) => {
    return dispatch => {
        const obj = {idMaster, dateMin,dateMax}
        axios.post('/catalog.fasol/getTrainerTraining',
            JSON.stringify(obj))
            .then(res => {
                dispatch({
                    type: actionTypes.GET_POST_TRAINER_TRAINING,
                    postTraining: res.data.result.result,
                })
            })
            .catch(err => {
                console.log('error: ',err);
            })
    }
}
export const getFutureTrainerTraining = (idMaster, dateMin, dateMax) => {
    return dispatch => {
        const obj = {idMaster, dateMin,dateMax}
        axios.post('/catalog.fasol/getTrainerTraining',
            JSON.stringify(obj))
            .then(res => {
                console.log('GET_FUTURE_TRAINER_TRAINING :', res.data.result.result);
                dispatch({
                    type: actionTypes.GET_FUTURE_TRAINER_TRAINING,
                    futureTraining: res.data.result.result,
                })
            })
            .catch(err => {
                console.log('error: ',err);
            })
    }
}
export const getTodayTrainerTraining = (idMaster, dateMin, dateMax) => {
    return dispatch => {
        const obj = {idMaster, dateMin,dateMax}
        axios.post('/catalog.fasol/getTrainerTraining',
            JSON.stringify(obj))
            .then(res => {
                dispatch({
                    type: actionTypes.GET_TODAY_TRAINER_TRAINING,
                    todayTraining: res.data.result.result,
                })
            })
            .catch(err => {
                console.log('error: ',err);
            })
    }
}

export const setChooseMasterAllInfo = (allInfo) => {
    
    return ({
        type: actionTypes.SET_CHOOSE_MASTER,
        chooseMaster: allInfo            
    });
}


