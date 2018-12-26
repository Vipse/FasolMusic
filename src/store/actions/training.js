import axios from './axiosSettings'
import * as actionTypes from './actionTypes';

export const getTrainingNotFinished = (idUser, dateMax, max) => {
    return dispatch => {
        let obj = {
            idUser
        };
        obj = (dateMax) ? {...obj, dateMax} : obj;
        obj = (max) ? {...obj, max} : obj;

        console.log("getTrainingNotFinished", obj)
        axios.post('/catalog.fasol/getTrainingNotFinished',
            JSON.stringify(obj))
            .then(res => {
                console.log('res :', res.data.result.result);
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
