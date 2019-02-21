import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import moment from "moment";

export const sendNewInfoDoctor = (data) => {
    return (dispatch, getState) => {
        data.id=getState().auth.id;
         axios.post('/fusers.doc/updateUserDoc',
                    JSON.stringify(data))
            .then(res => {
                dispatch({
                    type: actionTypes.SEND_NEW_INFO_DOCTOR,
                });
                dispatch(getInfoDoctor(data.id));
            })
            .catch(err => {
                console.log(err);
            })
    }
};

export const getInfoDoctor = (id) => {
    let obj = {id};
    return (dispatch) => {

        return axios.post('/catalog.fasol/getUserInfo',
         JSON.stringify(obj))
            .then(res => {

                if (res.data.result && res.data.result.data.userGroup === 'master') {
                    res.data.result.data.id = id;

                    dispatch({
                        type: actionTypes.INFO_DOCTOR,
                        profileDoctor: res.data.result.data,
                    });
                }

                return res;
            })
            .catch(err => {
                console.log(err);
            })
    }
};

export const getTrainerTrainings = (idMaster, dateMin, dateMax) => {
    let data = {
        idMaster,
        dateMin,
        dateMax
    };

    return (dispatch) => {

        return axios.post('/catalog.fasol/getTrainerTraining',
            JSON.stringify(data))
            .then(res => {
                console.log("getTrainerTraining", res);

                res.data.result.result.dateStart = dateMin;

                dispatch({
                    type: actionTypes.TRAINER_TRAININGS,
                    trainerTrainings: res.data.result.result,
                });

                return res;
            })
            .catch(err => {
                console.log(err);
            })
    }
};

export const getAllDocIntervals = (id) => {
    return (dispatch, getState) => {
        let user;
        id ? user = id : user = getState().auth.id;
        axios.post('/catalog.doc2/allDocInterval/id/' + user)
            .then(res => {
                dispatch({
                    type: actionTypes.GET_ALL_DOC_INTERVALS,
                    intervalsDoctor: res.data.result,
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
};

export const getDateWorkIntervalWithoutMakingAppAll = (id_doc) => {
    return (dispatch) => {
        return axios.post('/catalog.doc2/getDateWorkIntervalWithoutMakingAppAll', JSON.stringify({
            id_doc: id_doc,
            datestart: +moment().format("X")+1800
        }))
            .then(res => {
                dispatch({
                    type: actionTypes.DOC_INTERVALS_WITH_APPS_ALL,
                    intervals: res.data,
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
};
export const uploadFile = (file) => {
  return () => {
    const data = new FormData();
    data.append('file', file);
    return axios.post('https://web.fasolonline.ru/upload.php', data)
      .then(res => {
        return res
      })
      .catch(err => {
        console.log(err);
      })
  }
};
