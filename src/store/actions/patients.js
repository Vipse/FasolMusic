import axios from './axiosSettings'
import * as actionTypes from './actionTypes';

import moment from "moment";

import {getDateWorkIntervalWithoutMakingAppAll} from "./doctorData";
import MyCoach from './../../components/MyCoach/index';
export const getDateInterval = (beginDay, endDay) => {
    return (dispatch, getState) => {
        let obj =
            {
                id_doc: getState().auth.id,
                datestart: beginDay,
                dateend: endDay
            };

        axios.post('/catalog.doc2/getDateWorkInterval', JSON.stringify(obj))
            .then(rez => {
                dispatch({
                    type: actionTypes.GET_DATE_INTERVAL,
                    intervals: rez.data.result,
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
}
export const getDateIntervalWithoutMakingApp = (beginDay, endDay, id) => {
    return (dispatch, getState) => {
        let obj =
            {
                id_doc: id ? id : getState().auth.id,
                datestart: beginDay,
                dateend: endDay
            };

        axios.post('/catalog.doc2/getDateWorkIntervalWithoutMakingApp', JSON.stringify(obj))
            .then(rez => {
                dispatch({
                    type: actionTypes.GET_DATE_INTERVAL_WITHOUT_MAKING_APP,
                    intervals: rez.data,
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
}
export const setReception = (reception) => {

    return (dispatch, getState) => {
        let obj = {
            ...reception,
            id_doc: getState().auth.id
        };

        return axios.post('/catalog.doc2/makingApp',
            JSON.stringify(obj))
            .then(res => {
                dispatch({
                    type: actionTypes.SET_RECEPTION,
                    isReceptionRecorded: res.data.code === 200,
                    receptionRecordedID: res.data.code === 200 ? res.data.id : moment().format('x')
                })
                return res
            })
            .catch(err => {
                console.log(err);
            });
    }
}
export const setReceptionByPatient = (reception) => {

    return (dispatch, getState) => {
        let obj = {
            ...reception,
            id_user: getState().auth.id
        };
        return axios.post('/catalog.doc2/makingApp',
            JSON.stringify(obj))
            .then(res => {
                dispatch(getPatientDoctors());
                dispatch(getDateWorkIntervalWithoutMakingAppAll(reception.id_doc));
                return res;
            })
            .catch(err => {
                console.log(err);
            });
    }
}


export const getDocPatients = () => {
    return (dispatch, getState) => {
        axios.get('/catalog.doc2/getPatientsByDoctorId/id/' + getState().auth.id)
            .then(rez => {
                dispatch({
                    type: actionTypes.GET_DOCTORS_PATIENTS,
                    patients: rez.data,
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const makeReview = (obj) => {
    return (dispatch, getState) => {
        obj.id_user = getState().auth.id;
        return axios.post('/catalog.doc2/putCommentToDoc',JSON.stringify(obj))
            .then((res) => res)
            .catch(err => {
                console.log(err);
            })
    }
};

export const getPatientDoctors = (count, both) => {
    return (dispatch, getState) => {

        let obj = {
            id: getState().auth.id,
            max: count ? count : 0
        };

        axios.post('/catalog.doc2/getDoctorIdByPatients', JSON.stringify(obj))
            .then(rez => {
                count ?
                dispatch({
                    type: actionTypes.GET_PATIENT_DOCTORS_SHORT,
                    patientDoctors: rez.data,
                })
                  :
                dispatch({
                type: actionTypes.GET_PATIENT_DOCTORS,
                patientDoctors: rez.data,
                })
            })
            .catch(err => {
                console.log(err);
            });
        count && both ?
        axios.post('/catalog.doc2/getDoctorIdByPatients',
                    JSON.stringify({id:getState().auth.id}))
            .then(rez => {
                dispatch({
                    type: actionTypes.GET_PATIENT_DOCTORS,
                    patientDoctors: rez.data,
                })
            })
            .catch(err => {
                console.log(err);
            }) : null
    }
};

export const getSelectedPatientInfo = (id) => {
    return (dispatch, getState) => {
        let user_id = id ? id : getState().patients.selectedId;

        axios.get('/catalog.doc2/getInfoByUserId/id_user/' + user_id + '/id_doc/' + getState().auth.id)
            .then(rez => {
                if (rez.data.code === 501) {
                    dispatch({
                        type: actionTypes.GET_SELECTED_PATIENT_INFO,
                        infoUser: null,
                    })
                } else {
                    const {diseasesArr, treatmentArr, infoUser} = rez.data.result;
                    dispatch({
                        type: actionTypes.GET_SELECTED_PATIENT_INFO,
                        diseases: diseasesArr,
                        treatments: treatmentArr,
                        infoUser: infoUser,
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const getNotDocPatients = (name) => {
    if (name === "" || name === " ") {
        return (dispatch) => {
            dispatch({
                type: actionTypes.GET_NOT_DOCTORS_PATIENTS,
                patients: []
            })
        }
    }
    return (dispatch, getState) => {
        let obj = {
            id: getState().auth.id,
            name,
        };
        return axios.post('/catalog.doc2/getNoPatientsByDoctorId', JSON.stringify(obj))
            .then(rez => {
                dispatch({
                    type: actionTypes.GET_NOT_DOCTORS_PATIENTS,
                    patients: rez.data
                });
                return rez;
            })
            .catch(err => {
                console.log(err);
                return err;
            })
    }
}
export const searchUsers = (name) => {
    return (dispatch, getState) => {
        let obj = {
            id: getState().auth.id,
            filter: getState().auth.mode === "user" ? "doc" : "user",
            name,
        };
        axios.post('/catalog.doc2/getDoctorOrPatientsListShortById', JSON.stringify(obj))
            .then(rez => {
              dispatch({
                    type: actionTypes.GET_RESULTS_HEADER_SEARCH,
                    usersHeaderSearch: rez.data,
                })
            })
            .catch(err => {
                console.log(err);
                return err;
            })
    }
}
export const getNotPatientDoctors = (name) => {
    if (name === "" || name === " ") {
        return (dispatch) => {
            dispatch({
                type: actionTypes.GET_NOT_PATIENT_DOCTORS,
                notPatientDoctors: [],
            })
        }
    }
    return (dispatch, getState) => {
        let obj = {
            id: getState().auth.id,
            name,
        };
        return axios.post('/catalog.doc2/getNoDoctorByPatientsId', JSON.stringify(obj))
            .then(rez => {
                dispatch({
                    type: actionTypes.GET_NOT_PATIENT_DOCTORS,
                    notPatientDoctors: rez.data,
                })
                return rez;
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const clearNotDocPatients = () => {
    return {
        type: actionTypes.GET_NOT_DOCTORS_PATIENTS,
        patients: [],
    }
}
export const clearNotPatientDoctors = () => {
    return {
        type: actionTypes.GET_NOT_PATIENT_DOCTORS,
        notPatientDoctors: [],
    }
}

export const addPatient = (id, name, getInfo = false) => {
    return (dispatch, getState) => {
        let obj = {
            doctorID: getState().auth.id,
            patientID: id,
        }
        axios.post('/catalog.doc2/putPatientsByDoctorId', JSON.stringify(obj))
            .then(rez => {

                dispatch(getNotDocPatients(name));
                getInfo && dispatch(getSelectedPatientInfo(id));
                dispatch(getDocPatients());
            })
            .catch(err => {
                console.log(err);
            })
    }
}
export const addOrDeleteUserFromSearch = (id, name, flag) => {
    return (dispatch, getState) => {
        if (getState().auth.mode === "user") {
            flag === "add" ?
                axios.post(`/catalog.doc2/addFavoriteDoc/id_user/${getState().auth.id}/id_doc/${id}`)
                    .then(() => {
                        name ? dispatch(searchUsers(name)) : null;
                        dispatch(getPatientDoctors());

                    })
                    .catch(err => {
                        console.log(err);
                    })
                :
                axios.get(`/catalog.doc2/delFavoriteDoc/id_user/${getState().auth.id}/id_doc/${id}`)
                    .then(() => {
                        name ? dispatch(searchUsers(name)) : null;
                        dispatch(getPatientDoctors());


                    })
                    .catch(err => {
                        console.log(err);
                    })


        } else {
            if(flag === "add") {
                let obj = {
                    doctorID: getState().auth.id,
                    patientID: id,
                };
                axios.post('/catalog.doc2/putPatientsByDoctorId', JSON.stringify(obj))
                    .then(rez => {
                        name ? dispatch(searchUsers(name)) : null;
                        dispatch(getDocPatients())

                    })
                    .catch(err => {
                        console.log(err);
                    })
            } else {
                axios.get('/catalog.doc2/removePatientFromDoctor/id/' + getState().auth.id + '/patientId/' + id)
                    .then(rez => {
                        name ? dispatch(searchUsers(name)) : null;
                        dispatch(getDocPatients())
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }


        }


    }
};


export const addDoctor = (id, name) => {
    return (dispatch, getState) => {
        axios.post(`/catalog.doc2/addFavoriteDoc/id_user/${getState().auth.id}/id_doc/${id}`)
            .then(() => {
                dispatch(getPatientDoctors());
                name ? dispatch(getNotPatientDoctors(name)) : null;
                //dispatch(getDocPatients());
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const removePatient = (id_user, id_doctor) => {
    return (dispatch, getState) => {
        let doc_id = id_doctor ? id_doctor : getState().auth.id;
        axios.get('/catalog.doc2/removePatientFromDoctor/id/' + doc_id + '/patientId/' + id_user)
            .then(rez => {
                dispatch(getDocPatients());
                //dispatch(getNotDocPatients(''));
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const removeDoctor = (id_doctor) => {
    return (dispatch, getState) => {
        let id_user = getState().auth.id;
        axios.get('/catalog.doc2/getMyMastersOrStudents' + id_user+ '/id_doc/' + id_doctor)
            .then(() => {
                dispatch(getPatientDoctors());
                //dispatch(getNotDocPatients(''));
            })
            .catch(err => {
                console.log(err);
            })
    }
}





export const selectPatient = (id) => {
    return {
        type: actionTypes.SELECT_PATIENT,
        id: id,
    }
}

export const unselectPatient = () => {
    return {
        type: actionTypes.UNSELECT_PATIENT,
    }
}

//fasol

export const setFreeIntervals = (freeIntervals, discipline ) => {

  
    return (dispatch, getState) => {
        let obj = { discipline : [] };
        let type = {vocals : '125485', guitar : '125470'};

        for( let key in type ){
            if(String(key) === discipline){
                obj.discipline.push(type[key]);
            }
        }
        dispatch({
            type: actionTypes.SET_FREE_INTERVALS,
            freeIntervals: freeIntervals,
        })

        console.log("obj", obj)
        axios.post('/catalog.fasol/getMasterList', JSON.stringify({ 'discipline' : [125485, 125470]}))
            .then((rez) => {

                console.log("RRR", rez.data.result.masterlist)
                dispatch({
                    type: actionTypes.GET_MASTER_LIST,
                    trainerList: rez.data.result.masterlist,
                })
                
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const setNeedSaveIntervals = (countTraining) => {
    return {
        type: actionTypes.SET_NEED_SAVE_INTERVALS,
        abonementIntervals: { visibleTrialModal: countTraining.visibleTrialModal, countTraining: countTraining.countTraining},
        amountTraining: countTraining.countTraining
    }
}





// /putMessage
export const sendMessage = (message) => {


    return (dispatch, getState) => {
        let obj = {
            ...message,
            from: getState().auth.id,
        }

        axios.post('/catalog.doc2/putMessage', JSON.stringify(obj))
            .then(rez => {
                console.log(rez)
            })
            .catch(err => {
                console.log(err);
            })
    }
}
