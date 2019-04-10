import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import { getInfoDoctor } from "./coachData";

export const getInfoPatient = (id) => {

    return (dispatch) => {
        return axios.post('/catalog.fasol/getUserInfo',JSON.stringify({id}))
            .then(res => {
                if (res.data.result && res.data.result.data.userGroup === 'student') {
                    res.data.result.data.id = id;
                    dispatch({
                        type: actionTypes.INFO_PATIENT,
                        profileStudent: res.data.result.data,
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
        console.log("savingUserData", data);

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
