import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import * as actions from '../actions'
import { message } from 'antd'
import { getPrimarySubsription } from '../../containers/Schedule/shedule';

export const setParamsId = (params) => {
    return ({
        type: actionTypes.SET_PARAMS_ID,
        params
    });
}

export const getAvailableInterval = (dateStart, dateEnd, discipline, isCallAdmin) => {
    if (!Array.isArray(discipline)) discipline = [discipline]
    let obj = { dateStart, dateEnd, discipline, isCallAdmin };

    return (dispatch) => {
        dispatch(actions.startLoading())

        return axios.post('/catalog.fasol/getIntervalOnWeekdaysOnlyDate', JSON.stringify(obj))
            .then(rez => {

                if (!rez.data.error) {
                    if (!rez.data.result.interval) {
                        message.info('На выбранной неделе нет свободных тренеров - перейди на следующую неделю')
                    }
                    else {
                        dispatch({
                            type: actionTypes.GET_AVAILABLE_INTERVAL,
                            freeInterval: rez.data.result.interval,
                        })
                        dispatch({
                            type: actionTypes.SET_WEEKDAYS_AND_DISCIPLINE_AND_ARRMASTERS,
                            masters: rez.data.result.masters
                        })
                    }
                }
                dispatch(actions.endLoading())
            })
            .catch(err => {
                console.log(err);
                dispatch(actions.endLoading())
            })
    }
}

export const getTheMasterInterval = (dateStart, dateEnd, idMaster, weekdays, isCallAdmin) => {
    let obj = {
        dateStart,
        dateEnd,
        idMaster,
        weekdays,
        isCallAdmin
    };

    return (dispatch) => {
        return axios.post('/catalog.fasol/getMasterIntervalOnlyDate', JSON.stringify(obj))
            .then(res => {

                if (!res.data.error) {
                    dispatch({
                        type: actionTypes.GET_THE_MASTER_INTERVAL,
                        freeInterval: res.data.result.interval,
                    })
                    return res;
                }
            })
            .catch(err => console.log(err))
    }
}

export const masterFreeOnDate = (date, chooseMasters) => {

    let obj = {
        date,
        arrMaster: chooseMasters
    };

    return (dispatch) => {
        return axios.post('/catalog.fasol/masterFreeOnDate', JSON.stringify(obj))
            .then(res => {
                dispatch({
                    type: actionTypes.GET_FULL_INFO_MASTERS,
                    fullInfoMasters: res.data.result.masters,
                })
                return res;
            })
            .catch(err => { console.log(err); })
    }
}

export const getStudentsSchedule = (id, dateStart, dateEnd, disciplineCode) => {
    let obj = {
        idStudent: id,
        dateStart,
        dateEnd
    };
    return (dispatch) =>
        axios.post('/catalog.fasol/GetSubscriptionsStudentDate2', JSON.stringify(obj))
            .then(rez => {
                if (rez.status == 200) {
                    const data = rez.data.result;

                    const objPrimarySubsription = getPrimarySubsription(data, disciplineCode);


                    const { subscription: subs, discipline } = objPrimarySubsription;
                    dispatch({
                        type: actionTypes.GET_STUDENTS_SCHEDULE,
                        listSchedule: subs ? subs : {},
                    })

                    //если первый раз идет вызов
                    if (!disciplineCode) {

                        dispatch(actions.changeCurrDiscipline(discipline))
                        dispatch(actions.getCountTrainingByDiscipline(id, objPrimarySubsription.discipline))
                    }
                    //    else{
                    //         dispatch(actions.getCountTrainingByDiscipline(id, disciplineCode))
                    //    }

                }
            })
            .catch(err => console.log(err))
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
                
                if (!res.data.error) {

                    const trainerTraining = getPrimarySubsription(data, codeDisc)

                    dispatch({
                        type: actionTypes.GET_TRAINER_TRAINING,
                        listSchedule: trainerTraining.subscription,
                    })

                    //если первый раз идет вызов
                    if (!codeDisc) {
                        // dispatch({
                        //     type: actionTypes.GET_TRAINER_TRAINING_BY_TRAINER,
                        //     eventTraining: formatTrainng,
                        // })
                        dispatch(actions.changeCurrDiscipline(trainerTraining.discipline))
                        dispatch(actions.getCountTrainingByDiscipline(idMaster, trainerTraining.discipline))
                    }
                }
            })
            .catch(err => {
                console.log('error: ', err);
            })
    }
}

export const clearFreeInterval = () => {
    return ({
        type: actionTypes.GET_THE_MASTER_INTERVAL,
        freeInterval: []
    });
}


