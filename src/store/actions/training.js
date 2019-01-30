import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import { getInfoMasters } from './student'

export const getTrainingNotFinished = (idUser, dateMax, max) => {
    return dispatch => {
        let obj = {
            idUser
        };
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
                rez.data.result.result.forEach(el => {
                    if(obj.hasOwnProperty('idStudent')){
                            arr.push(getInfoMasters(el.idMaster)
                            .catch((err) => { console.log(err)}));
                    }
                    else if(obj.hasOwnProperty('idMaster')){
                            arr.push(getInfoMasters(el.idStudent)
                                .catch((err) => { console.log(err)}));
                    }
                });
                          
                return Promise.all(arr)
                    .then((rez) => {
                            dispatch({
                                type: actionTypes.GET_MY_MASTERS_OR_STUDENTS,
                                myCoachOrStudents: rez,
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
                console.log("getAllTrainingStudent", res);
                    dispatch({
                        type: actionTypes.GET_ALL_STUDENT_TRAININGS,
                        studentTrainings: !res.data.error ? res.data.result : []
                    })
            })
            .catch(err => console.log(err));
    }
};

export const setHomeworkEdit = (idTraining, homework) => {
    const obj = {
        idTraining,
        homework
    };
    return (dispatch) => {
        axios.post('/catalog.fasol/homeworkEdit', JSON.stringify(obj))
            .then(res => {
                    console.log("homeworkEdit", res);
            })
            .catch(err => console.log(err));
    }
};



export const unauthorizedTrialDataSave = (data) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.UNAUTHORIZED_TRIAL_DATA,
            data: data
        })
    }
};