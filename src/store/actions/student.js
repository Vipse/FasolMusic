import axios from './axiosSettings'
import * as actionTypes from './actionTypes';

import moment from "moment";


export const getStudentsSchedule = (id, dateStart, dateEnd, disc) => {
    let obj = { 
        idStudent: id,
        dateStart,
        dateEnd
     };
    return (dispatch) =>
        axios.post('/catalog.fasol/GetSubscriptionsStudentDate2', JSON.stringify(obj))
            .then(rez => {
               if(rez.status == 200){
                   let data = rez.data.result;
                   let final = {};
                   let popularDisc = null;

                   const getMainDiscipline = (key, data) => {
                    
                       if (key == 'primary' && Object.keys(data[key])){
                           
                        popularDisc = Object.keys(data[key])[0]
                       }
                   }
                   const spreadAllTraining = (key, key2, data) => {
                       const elem = (data[key])[key2];
                       const len = Object.keys(disc).length;
                       
                       if(!len || len && disc.code == key2){
                            final = { ...final, ...elem }
                       }
                       
                   }

                    for(let key in data){
                        getMainDiscipline(key, data);
                    }
                    for(let key in data){
                        for(let key2 in data[key]){
                            spreadAllTraining(key, key2, data)
                        }
                    }

                   dispatch({
                       type: actionTypes.GET_STUDENTS_SCHEDULE,
                       studentSchedule: final,
                   })
                   
                   //если нету ключей значит первый раз идет вызов
                   !Object.keys(disc).length && popularDisc && dispatch({
                       type: actionTypes.CHANGE_CURRENT_DISCIPLINE,
                       currDiscipline: popularDisc,
                   });
               }              
            })
            .catch(err => console.log(err))
}

export const handleSelecting = (id) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.HANDLE_SELECTING,
            id,
        })
    }
}

export const getUserInfo = (idMaster) => {
    let obj = {id : idMaster};
    return (dispatch) =>
         axios.post('/catalog.fasol/getUserInfo', JSON.stringify(obj))
        .then(rez => {
            let fdata = rez.data.result.data;
            fdata['idMaster'] = idMaster;
            fdata.hasOwnProperty('aboutme') ? fdata.aboutme = fdata.aboutme.replace(/(['])/g, "\"") : ''
            fdata.hasOwnProperty('bestcomment') ? fdata.bestcomment = fdata.bestcomment.replace(/(['])/g, "\"") : ''

            dispatch({
                type: actionTypes.GET_USER_INFO,
                userInfo: fdata,
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
                let fdata = rez.data.result.data;
                fdata['idMaster'] = idMaster;
                fdata.hasOwnProperty('aboutme') ? fdata.aboutme = fdata.aboutme.replace(/(['])/g, "\"") : ''
                fdata.hasOwnProperty('bestcomment') ? fdata.bestcomment = fdata.bestcomment.replace(/(['])/g, "\"") : ''
                return rez.data.result.data;
            })
            .catch(err => {
                console.log(err);
            })

}

export const getInfoStudents = (idStudent) => {
    let obj = {id : idStudent};

    return axios.post('/catalog.fasol/getUserInfo', JSON.stringify(obj))
        .then(rez => {
            let fdata = rez.data.result.data;
            fdata['idStudent'] = idStudent;
            fdata.hasOwnProperty('aboutme') ? fdata.aboutme = fdata.aboutme.replace(/(['])/g, "\"") : ''
            fdata.hasOwnProperty('bestcomment') ? fdata.bestcomment = fdata.bestcomment.replace(/(['])/g, "\"") : ''
            return fdata;
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

                if (!Array.isArray(res.data.result.interval))
                    res.data.result.interval.dateStart = dateStart;
                else {
                    res.data.result.interval = {};
                    res.data.result.interval.dateStart = dateStart;
                }

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

export const getAvailableInterval = (dateStart, dateEnd, weekdays, discipline, isCallAdmin) => {
    if( !Array.isArray(discipline)) discipline = [discipline]
    let obj =  { dateStart , dateEnd, discipline, isCallAdmin};

    return (dispatch) => {

        return axios.post('/catalog.fasol/getIntervalOnWeekdaysOnlyDate', JSON.stringify(obj))
            .then(rez => {
                    // let answer = []
                    // let freeInterval = rez.data.result.interval;

                    // for(let elem in freeInterval){
                    //     answer.push({
                    //         day: moment(+elem * 1000).day(),
                    //         intervals: freeInterval[elem]
                    //     })
                    // }
                    if(rez.data){
                        dispatch({
                            type: actionTypes.GET_AVAILABLE_INTERVAL,
                            freeInterval: rez.data.result.interval,
                        })
                        dispatch({
                            type: actionTypes.SET_WEEKDAYS_AND_DISCIPLINE_AND_ARRMASTERS,
                            weekdays: weekdays,
                            discipline: discipline,
                            masters: rez.data.result.masters
                        })
                        return rez.data.result.interval; 
                    }
                
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
                
                if(res.data){
                    dispatch({
                        type: actionTypes.GET_THE_MASTER_INTERVAL,
                        theMasterInterval: res.data.result.interval,
                    })
                    return res;
                    // let answer = {}
                    // let freeInterval = res.data.result.interval;

                    // for (let elem in freeInterval) {
                    //     answer[moment(+elem * 1000).day()] = { ...freeInterval[elem]}
                    // }
                    // dispatch({
                    //     type: actionTypes.GET_THE_MASTER_INTERVAL,
                    //     theMasterInterval: answer,
                    // })
                    // return res;
                }
            })
            .catch(err => console.log(err))
    }
}

export const getTrainingTrialStatusByDiscipline = (disciplineId, idStudent) => {
    let obj = {
        discipline: disciplineId,
        idStudent
    };

    return (dispatch) => {
        return axios.post('/catalog.fasol/isTrainingTrial', JSON.stringify(obj))
            .then(res => {
                console.log("getTrainingTrialStatusByDiscipline", res);
                dispatch({
                    type: actionTypes.GET_TRAINING_TRIAL_STATUS,
                    disciplineId,
                    status: res.data.result.isTrialTraining
                });
                return res.data.result;
            })
            .catch(err => {
                console.log(err)
            })
    }
};

export const getTrainingsTrialStatus = (idStudent) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.RESET_TRAININGS_TRIAL_STATUS,
        });

        let arr = getState().loading.selectors.discipline.map(item =>
            dispatch(getTrainingTrialStatusByDiscipline(item.id, idStudent)));

        return Promise.all(arr)
            .then((res) => {
                dispatch({
                    type: actionTypes.SET_TRAININGS_AVAILABLE_STATUS,
                    isTrialTrainingsAvailableCount:
                    res.filter(discipline => !discipline.isTrialTraining).length
                });
            })
            .catch(err => {
                console.log(err)
            })
    };
};

export const getDisciplineCommunication = (idStudent) => {

    return (dispatch) => {
        return axios.post('/catalog.fasol/getStudentMasterDisciplineCommunication', JSON.stringify({idStudent}))
            .then(res => {

                let obj = {};
                res.data.result.forEach((el) => obj[el.discipline] = el)


                dispatch({
                    type: actionTypes.GET_DISCIPLINE_COMMUNICATION,
                    discCommunication: obj
                });
                return res.data.result;
            })
            .catch(err => { console.log(err)})
    }
}


export const addAmountTraining = (idSubscription, addAmount) => {
    const obj = {
        idSubscription,
        addAmount
    }
    return (dispatch) => {
        return axios.post('/catalog.fasol/addAmountTraining', JSON.stringify(obj))
            .then(res => {
                console.log(res);
            })
            .catch(err => {console.log(err)})
    }
}

export const getUseFrozenTraining = (idStudent) => {
    const obj = {idStudent};

    return (dispatch) => {
        return axios.post('/catalog.fasol/UseFrozenTraining', JSON.stringify(obj))
            .then(res => {
                console.log('UseFrozenTraining', res);

                dispatch({
                    type: actionTypes.GET_USE_FROZEN_TRAINING,
                    useFrozenTraining: res.data.frozenTraining
                });
            })
            .catch(err => {console.log(err)})
    }
}

export const editUseFrozenTraining = (idStudent, amountTraining) => {
    const obj = {idStudent, amountTraining}

    return (dispatch) => {
        return axios.post('/catalog.fasol/UseFrozenTraining', JSON.stringify(obj))
            .then(res => {

                console.log(res);
                dispatch({
                    type: actionTypes.GET_USE_FROZEN_TRAINING,
                    useFrozenTraining: res.data.frozenTraining
                });
            })
            .catch(err => {console.log(err)})
    }
}

export const transferTrainPopupDisable = () => {

    return ({
        type: actionTypes.SET_TRANSFER_TRAIN_MODAL_INACTIVE
    });
}

export const setPushBtnTransferTraining = (type) => {

    return ({
        type: actionTypes.SET_IS_PUSH_BTN_TRANSFER,
        isPushBtnTransfer: type
    });
}

export const unsetPushBtnTransferTraining = () => {

    return ({
        type: actionTypes.UNSET_IS_PUSH_BTN_TRANSFER,
        isPushBtnTransfer: false
    });
}
export const setPushBtnAddTraining = (type) => {

    return ({
        type: actionTypes.SET_IS_PUSH_BTN_ADD,
        isPushBtnAdd: type
    });
}

export const setPushTrialTraining = (type) => {

    return ({
        type: actionTypes.SET_IS_PUSH_TRIAL_TRAINING,
        isPushBtnTrialTraining: type
    });
}

export const noSetBtnTraining = () => {

    return ({
        type: actionTypes.SET_NO_PUSH_BTN,
        isPushBtnAdd: false,
        isPushBtnTransfer: false
    });
}

export const setMasterTheDisicipline = (idMaster) => {

    return ({
        type: actionTypes.SET_MASTER_THE_DISCIPLINE,
        selectMaster: idMaster
    });
}

export const changeBtnBack = (status) => {

    return ({
        type: actionTypes.CHANGE_BTN_BACK,
        statusBtnBack: status
    });
}

export const changeBtnTransfer = (status) => {
    return ({
        type: actionTypes.CHANGE_PUSH_BTN_TRANSFER,
        isPushBtnTransfer: status
    });
}



export const rateMaster = (idStudent, idMaster, rate, feedback) => {
    const obj = {
        idStudent,
        idMaster,
        rating: rate,
        feedback
    };

    return (dispatch) => {
        return axios.post('/catalog.fasol/addRateToMaster', JSON.stringify(obj))
            .then(res => {
                //dispatch(updateRate)
                return res;
            })
            .catch(err => {console.log(err)})
    }
};

