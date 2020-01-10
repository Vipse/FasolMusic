import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import * as actions from '../actions'

import {message} from 'antd'
import moment from "moment";
import { getPrimarySubsription } from '../../containers/Schedule/shedule';




export const setParamsStatusPush = (params) => {
    return ({
        type: actionTypes.SET_PARAMS_STATUS_PUSH,  
        params   
    });
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









export const getTrainingTrialStatusByDiscipline = (disciplineId, idStudent) => {
    let obj = {
        discipline: disciplineId,
        idStudent
    };

    return (dispatch) => {
        return axios.post('/catalog.fasol/isTrainingTrial', JSON.stringify(obj))
            .then(res => {
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

        let arr = getState().loading.selectors.discipline.map(item => {
            dispatch(getTrainingTrialStatusByDiscipline(item.id, idStudent));
        })

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

export const clearAllBookingTrainings = (idStudent) => {
    const obj = {
        "idStudent": idStudent
      };
    
    return (dispatch) => {
        return axios.post('/catalog.fasol/removeBookingByIdStudent', JSON.stringify(obj))
            .then(res => {
                return res;
            })
            .catch(err => {console.log(err)})
    }
}