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

export const getInfoStudents = (idStudent) => {
    let obj = {id : idStudent};

    return axios.post('/catalog.fasol/getUserInfo', JSON.stringify(obj))
        .then(rez => {
            rez.data.result.data['idStudent'] = idStudent;
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
    let obj =  { dateStart , dateEnd,  weekdays,discipline};

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
    debugger;
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
            .catch(err => {console.log(err)})
    }
};

export const getTrainingsTrialStatus = (idStudent) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.RESET_TRAININGS_TRIAL_STATUS,
        });

        getState().loading.selectors.discipline.forEach(item =>
            dispatch(getTrainingTrialStatusByDiscipline(item.id, idStudent)));
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
            .catch(err => {console.log(err)})
    }
}

export const saveDisciplineCommunication = (idStudent, idMaster, discipline) => {
    const obj = {
        idStudent,
        idMaster,
        discipline
    }
    return (dispatch) => {
        return axios.post('/catalog.fasol/saveStudentMasterDisciplineCommunication', JSON.stringify(obj))
            .then(res => {
               
                console.log(res);
            
            })
            .catch(err => {console.log(err)})
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

export const saveStudentMasterDisciplineCommunication = (idStudent, idMaster, discipline) => {
    const obj = {
        idStudent,
        idMaster,
        discipline
    }
    
    return (dispatch) => {
        return axios.post('/catalog.fasol/saveStudentMasterDisciplineCommunication', JSON.stringify(obj))
            .then(res => {
                debugger;
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
                debugger;
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

export const rateMaster = (idStudent, idMaster, rate) => {
    const obj = {
        idStudent,
        idMaster,
        rating: rate
    };

    console.log(obj)
    return (dispatch) => {
        return axios.post('/catalog.fasol/addRateToMaster', JSON.stringify(obj))
            .then(res => {
                //dispatch(updateRate)
                return res;
            })
            .catch(err => {console.log(err)})
    }
};