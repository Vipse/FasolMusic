import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import {getInfoMasters, getInfoStudents} from './student'
import { setChatStory } from './chatWS'





export const handleChangeTime = (newStart, newEnd) => {
    return dispatch => {
        dispatch({
            type: actionTypes.HANDLE_CHANGE_TIME,
            newStart,
            newEnd
        })
    }
}












export const getTrainingNotFinished = (idUser, dateMin, dateMax, max) => {
    return dispatch => {
        let obj = {
            idUser
        };
        obj = (dateMin) ? {...obj, dateMin} : obj;
        obj = (dateMax) ? {...obj, dateMax} : obj;
        obj = (max) ? {...obj, max} : obj;

        axios.post('/catalog.fasol/getTrainingNotFinished',
            JSON.stringify(obj))
            .then(res => {
                console.log('getTrainingNotFinished', res.data.result.result);
                dispatch({
                    type: actionTypes.GET_TRAINING_NOT_FINISHED,
                    nearTraining: res.data.result.result,
                })
            })
            .catch(err => {
                console.log('error: ',err);
            })
    }
}

export const getNextTraining = (id) => {
    const obj = {
        idUser: id
    }
    return (dispatch) => {
        return axios.post('/catalog.fasol/nextTraining', JSON.stringify(obj))
            .then(res => {
                res.data.result.trainingInfo.start *= 1000;

                dispatch({
                    type: actionTypes.GET_NEXT_TRAINING,
                    nextTraining: res.data.result.trainingInfo,
                    nextTrainingTime: res.data.result.trainingInfo.start,
                })
                return res;
            })
            .catch(err => {console.log(err);})
    }
}


export const getMyMastersOrStudents = (obj) => {
    return (dispatch) => {

        axios.post('/catalog.fasol/getMyMastersOrStudents', JSON.stringify(obj))
            .then(rez => {
                let arr = [];

                if (!rez.data.error)
                    rez.data.result.result.forEach(el => {
                        if (obj.hasOwnProperty('idStudent')) {
                            arr.push(getInfoMasters(el.idMaster)
                                .catch((err) => {
                                    console.log(err)
                                }));
                        } else if (obj.hasOwnProperty('idMaster')) {
                            arr.push(getInfoStudents(el.idStudent)
                                .catch((err) => {
                                    console.log(err)
                                }));
                        }
                    });

                return Promise.all(arr)
                    .then((rez) => {
                        const filteredRez = rez.filter(item => !!item);
                        console.log('getMyMastersOrStudents', filteredRez);
                        dispatch({
                            type: actionTypes.GET_MY_MASTERS_OR_STUDENTS,
                            myCoachOrStudents: filteredRez,
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                    });
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const getAllTrainingStudent = (id, dateStart, dateEnd) => {
    const obj = {
        idStudent: id,
        dateStart,
        dateEnd
    };
    return (dispatch) => {
        axios.post('/catalog.fasol/getAllTrainingStudent', JSON.stringify(obj))
            .then(res => {

                let arr = [];
                if (!res.data.error) arr = res.data.result;

                arr.dateStart = dateStart;

                dispatch({
                    type: actionTypes.GET_ALL_STUDENT_TRAININGS,
                    studentTrainings: arr
                });
            })
            .catch(err => console.log(err));
    }
};

export const setHomeworkEdit = (idTraining, homework) => {
    const obj = {
        idTraining,
        homework
    };
    return () => {
        return axios.post('/catalog.fasol/homeworkEdit', JSON.stringify(obj))
            .then(res => {
                console.log("homeworkEdit", res);
                return res;
            })
            .catch(err => console.log(err));
    }
};

export const getFutureTrialTraining = (idStudent, discipline) => {

    const obj = {
        idStudent,
        discipline: discipline.code
    };

    return dispatch => {
        axios.post('/catalog.fasol/getTrialTrainingsByDisciplineToStudent', JSON.stringify(obj))
            .then(res => {
                dispatch({
                    type: actionTypes.GET_TRIAL_FUTURE_TRAINING,
                    futureTrialTraining: res.data.result,
                })
            })
            .catch(err => {
                console.log('error: ',err);
            })
    }
}


export const getCountTrainingByDiscipline = (idUser, discipline) => {

    const obj = {
        idUser,
        discipline: String(discipline)
    };
    
    return dispatch => {
        axios.post('/catalog.fasol/allTrainingByDiscipline', JSON.stringify(obj))
            .then(res => {

                dispatch({
                    type: actionTypes.GET_COUNT_TRAINING_BY_DISCIPLINE,
                    countTrainingDiscipline: res.data.balance,
                })
            })
            .catch(err => {
                console.log('error: ',err);
            })
    }
}

export const removeTrialTraining = (idTraining, isCallAdmin) => {

    return dispatch => {
        return axios.post('/catalog.fasol/removeTrialTraining', JSON.stringify({idTraining, isCallAdmin}))
            .then(res => {

                console.log('res', res)
            })
            .catch(err => {
                console.log('error: ',err);
            })
    }
}

export const issetTrial = (idStudent) => {

    return dispatch => {
        return axios.post('/catalog.fasol/issetTrial', JSON.stringify({idStudent}))
            .then(res => {
                dispatch({
                    type: actionTypes.IS_SET_TRIAL,
                    finishedTrial: res.data.result.finished,
                    willTrial: res.data.result.trial,
                })
                console.log('res', res)
            })
            .catch(err => {
                console.log('error: ',err);
            })
    }
}



export const unauthorizedTrialDataSave = (data) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.UNAUTHORIZED_TRIAL_DATA,
            data: data
        })
    }
};

export const saveNotification = (data) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.SAVE_NOTIFICATION,
            notifications: data
        })
    }
};

export const uploadTrainingChatHistory = (idTraining, chat) => {
    const obj = {
        idTraining,
        chat
    };

    return () => {
        axios.post('/catalog.fasol/saveChat', JSON.stringify(obj))
            .then(res => {
                console.log("saveChat", res);
                return res;
            })
            .catch(err => console.log(err));
    }
};

export const getTrainingChatHistory = (idTraining) => {
    const obj = {
        idTraining
    };

    return (dispatch) => {
        return axios.post('/catalog.fasol/getChatByTrainingId', JSON.stringify(obj))
            .then(res => {
                console.log("getChatByTrainingId", res);
                if (res && !res.error) dispatch(setChatStory([...res.data.result]));
                return res;
            })
            .catch(err => console.log(err));
    }
};

export const completeReception = (obj) => {
    return dispatch => {
        return axios.post('/catalog.fasol/trainingComplete',
            JSON.stringify(obj))
            .then(res => {
                console.log('completeReception', res);
                return res;
            })
            .catch(err => {
                console.log(err);
            })
    }
}
