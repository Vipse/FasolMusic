import axios from './axiosSettings'
import * as actionTypes from './actionTypes';

import moment from "moment";


export const getUserInfo = (idMaster) => {
    let obj = {id : idMaster};
    return (dispatch) =>
         axios.post('/catalog.fasol/getUserInfo', JSON.stringify(obj))
        .then(rez => {
            rez.data.result.data['idMaster'] = idMaster;
            dispatch({
                type: actionTypes.GET_USER_INFO,
                userInfo: rez.data.result.data,
            })
        })
        .catch(err => {
            console.log(err);
        })

}

export const getInfoMasters = (idMaster) => {
        let obj = {id : idMaster};

        return axios.post('/catalog.fasol/getUserInfo', JSON.stringify(obj))
            .then(rez => {
                rez.data.result.data['idMaster'] = idMaster;
                return rez.data.result.data;
            })
            .catch(err => {
                console.log(err);
            })
    
}



export const getDeadlinePay = (idStudent) => {
    let obj =  { idStudent };

    return (dispatch) => {
       
        axios.post('/catalog.fasol/getDeadlinePay', JSON.stringify(obj))
            .then(rez => {
                dispatch({
                    type: actionTypes.GET_DEADLINE_PAY,
                    deadlinePay: rez.data.result.result,
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const getMasterSchedule = (idMaster, dateStart, dateEnd) => {
    let data = {
        idMaster,
        dateStart,
        dateEnd
    };

    return (dispatch) => {

        return axios.post('/catalog.fasol/masterSchedule',
            JSON.stringify(data))
            .then(res => {
                console.log("masterSchedule", res);

                res.data.result.interval.dateStart = dateStart;

                dispatch({
                    type: actionTypes.MASTER_SCHEDULE,
                    masterSchedule: res.data.result.interval
                });

                return res;
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const createTraining = (obj) => {
    return (dispatch) => {
        return axios.post('/catalog.fasol/createTraining', JSON.stringify(obj))
            .then(res => {
                console.log("createTraining", res);
                return res;
            })
            .catch(err => {console.log(err);})
    }
}

export const getAvailableInterval = (dateStart, dateEnd, weekdays, discipline) => {
    let obj =  { dateStart , dateEnd, weekdays, discipline};

    console.log("GET", obj)
    return (dispatch) => {
       
        return axios.post('/catalog.fasol/getIntervalOnWeekdays', JSON.stringify(obj))
            .then(rez => {
                    console.log('AVAIL rez :', rez);
                    let answer = []
                    let freeInterval = rez.data.result.interval;

                    for(let elem in freeInterval){
                        answer.push({
                            day: moment(+elem * 1000).day(),
                            intervals: freeInterval[elem]
                        })
                    }

                dispatch({
                    type: actionTypes.GET_AVAILABLE_INTERVAL,
                    freeInterval: answer,
                })
                dispatch({
                    type: actionTypes.SET_WEEKDAYS_AND_DISCIPLINE_AND_ARRMASTERS,
                    weekdays: weekdays,
                    discipline: discipline,
                    masters: rez.data.result.masters
                })
            })
            .catch(err => {
                console.log(err);
            })
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
            .catch(err => {console.log(err);})
    }
}

export const getTheMasterInterval = (dateStart, dateEnd, idMaster, weekdays) => {

    let obj = {
        dateStart, 
        dateEnd,
        idMaster,
        weekdays
    };
  
    return (dispatch) => {
        return axios.post('/catalog.fasol/getMasterInterval', JSON.stringify(obj))
            .then(res => {
                let answer = []
                let freeInterval = res.data.result.interval;

                for(let elem in freeInterval){
                    answer.push({
                        day: moment(+elem * 1000).day(),
                        intervals: freeInterval[elem]
                    })
                }

                dispatch({
                    type: actionTypes.GET_THE_MASTER_INTERVAL,
                    theMasterInterval: answer,
                })
                return res;
            })
            .catch(err => {console.log(err);})
    }
}


export const setPushBtnTransferTraining = (type) => {
    
    return ({
        type: actionTypes.SET_IS_PUSH_BTN_TRANSFER,
        isPushBtnTransfer: type            
    });
}

export const setPushBtnAddTraining = (type) => {
    
    return ({
        type: actionTypes.SET_IS_PUSH_BTN_ADD,
        isPushBtnAdd: type            
    });
}
