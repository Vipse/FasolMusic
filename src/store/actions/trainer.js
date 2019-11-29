

import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import { getCountTrainingByDiscipline } from './training';
import { getPrimarySubsription } from '../../containers/Schedule/shedule';

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
                console.log('error: ', err);
            })
    }
}



export const getPostTrainerTraining = (idMaster, dateMin, dateMax) => {
    return dispatch => {
        const obj = { idMaster, dateMin, dateMax };
        axios.post('/catalog.fasol/getTrainerTraining',
            JSON.stringify(obj))
            .then(res => {
                console.log('getPostTrainerTraining:', res);
                dispatch({
                    type: actionTypes.GET_POST_TRAINER_TRAINING,
                    postTraining: res.data.result.result,
                })
            })
            .catch(err => {
                console.log('error: ', err);
            })
    }
}

export const getFutureTrainerTraining = (idMaster, dateMin, dateMax) => {
    return dispatch => {
        const obj = {
            idMaster,
            dateMin,
            dateMax,
            future: 1,
            withoutComplete: 1
        };
        return axios.post('/catalog.fasol/getTrainerTraining',
            JSON.stringify(obj))
            .then(res => {
                console.log('getFutureTrainerTraining:', res.data.result.result);
                dispatch({
                    type: actionTypes.GET_FUTURE_TRAINER_TRAINING,
                    futureTraining: res.data.result.result,
                })
            })
            .catch(err => {
                console.log('error: ', err);
            })
    }
}
export const getTodayTrainerTraining = (idMaster, dateMin, dateMax) => {
    return dispatch => {
        const obj = {
            idMaster,
            dateMin,
            dateMax,
            withoutComplete: 1
        }
        axios.post('/catalog.fasol/getTrainerTraining',
            JSON.stringify(obj))
            .then(res => {
                dispatch({
                    type: actionTypes.GET_TODAY_TRAINER_TRAINING,
                    todayTraining: res.data.result.result,
                })
            })
            .catch(err => {
                console.log('error: ', err);
            })
    }
}



export const setChooseMasterAllInfo = (allInfo) => {

    return ({
        type: actionTypes.SET_CHOOSE_MASTER,
        chooseMaster: allInfo
    });
}

