import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import { getInfoDoctor } from "./coachData";

export const getInfoPatient = (id) => {

    return (dispatch) => {
        return axios.post('/catalog.fasol/getUserInfo',JSON.stringify({id}))
            .then(res => {
                let fdata = res.data.result.data;
                if (fdata && fdata.userGroup === 'student') {
                    fdata.id = id;
                    fdata.hasOwnProperty('aboutme') ? fdata.aboutme = fdata.aboutme.replace(/(['])/g, "\"") : ''
                    fdata.hasOwnProperty('bestcomment') ? fdata.bestcomment = fdata.bestcomment.replace(/(['])/g, "\"") : ''

                    dispatch({
                        type: actionTypes.INFO_PATIENT,
                        profileStudent: fdata,
                    });
                }

                return res;
            })
            .catch(err => {
                console.log(err);
            })
    }
};

export const saveUserEdit = (data, userGroup) => {
    return (dispatch, getState) => {
        const userType = userGroup ? userGroup : getState().auth.mode;
        data.hasOwnProperty('aboutme') ? data.aboutme = data.aboutme.replace(/(["])/g, "\'") : ''
        data.hasOwnProperty('bestcomment') ? data.bestcomment = data.bestcomment.replace(/(["])/g, "\'") : ''
        
        
        return axios.post('/catalog.fasol/saveUserEdit',
            JSON.stringify(data))
            .then(res => {
                userType === 'student' ?
                    dispatch(getInfoPatient(data.id)) :
                    dispatch(getInfoDoctor(data.id));
                return res;
            })
            .catch(err => {
                console.log('error: ', err);
                return err;
            });
    };
};

export const changePassword = (id, newPass) => {
    const obj = {
        idUser: id,
        password: newPass
    };

    return (dispatch) => {
        console.log("changePasword", obj);

        return axios.post('/catalog.fasol/passwordReset',
            JSON.stringify(obj))
            .then(res => {
                return res;
            })
            .catch(err => {
                console.log('error: ', err);
                return err;
            });
    };
};
