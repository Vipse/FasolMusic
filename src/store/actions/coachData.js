import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import * as actions from '../actions'

export const getInfoDoctor = (id) => {
    let obj = {id};

    function getMainDiscipline(list, data){
        try{
            if(Array.isArray(data.disciplines)){
                return data.disciplines[0].discipline[0].id
            }
        }
        catch(err){
            console.log(err);
        }
        return null
    }

    return (dispatch, getState) => {

        return axios.post('/catalog.fasol/getUserInfo',
         JSON.stringify(obj))
            .then(res => {
                let fdata = res.data.result.data
                if (fdata && fdata.userGroup === 'master') {
                    fdata.id = id;
                    fdata.hasOwnProperty('aboutme') ?  fdata.aboutme = fdata.aboutme.replace(/(['])/g, "\"") : ''
                    fdata.hasOwnProperty('bestcomment') ? fdata.bestcomment = fdata.bestcomment.replace(/(['])/g, "\"") : ''


                    const disc = getMainDiscipline(getState().abonement.listDisciplines, fdata)
                    disc && dispatch(actions.changeCurrDiscipline(disc))
                    dispatch({
                        type: actionTypes.INFO_DOCTOR,
                        profileCoach: fdata,
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
