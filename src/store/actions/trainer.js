

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

export const getTrainerTraining = (idMaster, dateMin, dateMax, codeDisc) => {
    return dispatch => {
        const obj = {
            idMaster,
            dateMin,
            dateMax
        }


        return axios.post('/catalog.fasol/getTrainerTraining2',
            JSON.stringify(obj))
            .then(res => {
                let data = res.data.result.result;
               
                let formatTrainng = [];
                
                if (!res.data.error) {

                    debugger
                    const trainerTraining = getPrimarySubsription(data, codeDisc)

                    dispatch({
                        type: actionTypes.GET_TRAINER_TRAINING,
                        trainerTraining: trainerTraining.subscription,
                    })

                    //если первый раз идет вызов
                    if (!codeDisc) {
                        dispatch({
                            type: actionTypes.GET_TRAINER_TRAINING_BY_TRAINER,
                            eventTraining: formatTrainng,
                        })
                        dispatch(getCountTrainingByDiscipline(idMaster, trainerTraining.discipline))
                    }
                }

                // for (let key in allTraining) {
                //     if (allTraining.hasOwnProperty(key)){
                //         for(let element in allTraining[key]){
                //             for(let el in allTraining[key][element]){

                //                         const elem = allTraining[key][element].allInfo;
                //                         if(elem.disciplines.includes(currDiscipline.code) && !elem.isBooking){
                //                             formatTrainng.push({
                //                                 fio: elem.fio,
                //                                 id: elem.date,
                //                                 idMaster: elem.idMaster,
                //                                 idSubscription:elem.idSubscription,
                //                                 idStudent: elem.idStudent,
                //                                 isBooking: elem.isBooking,
                //                                 isComplete: elem.isComplete,
                //                                 start: new Date(elem.date * 1000),
                //                                 status: elem.status,
                //                                 wasTransfer: elem.wasTransfer


                //                             });
                //                         }
                //             }
                //         }

                //     }
                // }

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

