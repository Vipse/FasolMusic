import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import {getDocShortInfo} from "./doctor";

export const sendNewInfoPatient = (data) => {
    return (dispatch) => {
        return axios.post('/catalog.doc2/saveEditUser',
            JSON.stringify(data))
            .then(res => {
                dispatch(getDocShortInfo());
                return res
            })
            .catch(err => {
                console.log(err);
            })
    }
};

export const sendNewPasswordPatient = (oldPass, newPass, id) => {
    return (dispatch, getState) => {
        const id_patient = id ? id : getState().auth.id;

       return axios.post('/catalog.doc2/rePassDoc',
            JSON.stringify({
                id: id_patient,
                oldpass: oldPass,
                newpass: newPass
            }))
            .catch(err => {
                console.log(err);
            })
    }
};
export const hasNoReviewToFreeApp = () => {
    return (dispatch, getState) => {
        const id_patient = getState().auth.id;
        return axios.get(`/catalog.doc2/noCommentToFree/id/${id_patient}`)
            .then(res=>res.data)
    }
};

export const getInfoPatient = (id) => {
    const idstr = String(id);
    let obj = {"id":idstr};
    return (dispatch) => {
        axios.post('/catalog.fasol/getUserInfo',
            JSON.stringify(obj))
            .then(res => {
                console.log("receivedStudentData", res);
                res.data.result.data.id = obj.id;

                dispatch({
                    type: actionTypes.INFO_PATIENT,
                    profilePatient: res.data.result.data,
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
};

export const saveUserEdit = (data) => {
    return () => {
        console.log("savingUserData", data);
        return axios.post('/catalog.fasol/saveUserEdit',
            JSON.stringify(data))
            .then(res => res)
            .catch(err => {
                console.log('error: ', err);
            });
    };
};

export const sendUserPoleValue = (pole, value, id) => {
    return (dispatch, getState) => {
        const obj = {pole, id: id ? id : getState().auth.id, value};
        axios.post('/catalog.doc2/reUserPole',
            JSON.stringify(obj))
            .then(res => {
                dispatch({
                    type: actionTypes.SEND_USER_POLE_VALUE,
                    pole: pole.charAt(0).toUpperCase() + pole.slice(1),
                    value: res.data.result
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
};

export const deleteAvatar = (id) => {
    return (dispatch, getState) => {
        const user_id = (id ? id : getState().auth.id);
        axios.get('/catalog.doc2/deleteAvatar/id/' + user_id)
            .then(res => {
                dispatch(getInfoPatient(user_id));


            })
            .catch(err => {
                console.log(err);
            })
    }
};

export const getUserInfoShort = (id) => {
    return (dispatch, getState) => {
        let user;
        id ? user = id : user = getState().auth.id;
        axios.get('/catalog.doc2/userInfoShort/id/' + user)
            .then(res => {
                dispatch({
                    type: actionTypes.GET_USER_INFO_SHORT,
                    userInfoShort: res.data.result,
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
};
