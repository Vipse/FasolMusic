import axios from './axiosSettings'
import * as actionTypes from './actionTypes';

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
                        profileCoach: res.data.result.data,
                    });
                }

                return res.data.result.data;
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
