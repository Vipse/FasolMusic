import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import {getAllPatientVisits, getCountNearVisits} from "./schedules";

export const getAllTreatments = () => {

    return (dispatch, getState) => {
        let id_user = getState().auth.mode === "user" ? getState().auth.id : "";
        let id_doc = getState().auth.mode === "user" ? "" : getState().auth.id;
        axios.get('/catalog.doc2/getTreatments/id_user/'+id_user+'/id_doc/' + id_doc)
            .then(res => {
                console.log('[getAllTreatments]',res);
                dispatch({
                    type: actionTypes.GET_ALL_TREATMENTS,
                    treatments: res.data.result,
                });
            })
            .catch(err => {
                console.log(err);
        })
    }
}
export const getPaginationTreatments = (filters) => {

    return (dispatch, getState) => {
        let obj = {...filters};
        getState().auth.mode === "user" ? obj.id_user = getState().auth.id : obj.id_doc = getState().auth.id;
        return axios.post('/catalog.doc2/getTreatmentsNew', JSON.stringify(obj))
            .then(res => {
                dispatch({
                    type: actionTypes.GET_TREATMENTS,
                    treatments: res.data.result,
                    treatmentsCount: res.data.count
                });
                dispatch({
                    type: actionTypes.GET_COMPLETED_APPS,
                    completedApps: res.data,
                });
                return res
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const getActualTreatments = () => {
    return (dispatch, getState) => {
        axios.get('/catalog.doc2/getTreatmentsByDoctorId/id/'+getState().auth.id+'/status/topical')
            .then(res => {
                dispatch({
                    type: actionTypes.GET_ACTUAL_TREATMENTS,
                    treatments: res.data,
                });
            })
            .catch(err => {
                console.log(err);
        })
    }
}
export const getCompletedTreatments = () => {
    return (dispatch, getState) => {
        let isUser = getState().auth.mode === "user" ? "/isuser/1" : "";
        axios.get('/catalog.doc2/getTreatmentsByDoctorId/id/'+getState().auth.id+'/status/completed'+isUser)
            .then(res => {
                dispatch({
                    type: actionTypes.GET_COMPLETED_TREATMENTS,
                    treatments: res.data,
                });
            })
            .catch(err => {
                console.log(err);
        })
    }
};

export const getCompletedApps = (obj) => {
    return (dispatch, getState) => {
        return axios.post('/catalog.doc2/allMAcompleteMyIdUser',
            JSON.stringify({
                ...obj,
                id: getState().auth.id
            }))
            .then(res => {
                dispatch({
                    type: actionTypes.GET_COMPLETED_APPS,
                    completedApps: res.data,
                });
            })
            .catch(err => {
                console.log(err);
            })
    }
}
export const addFileToApp = (file, id) => {
    return () => {
        let obj = {
            id: id,
            files: [file]
        };
        console.log(obj, "Объект для отправки на /catalog.doc2/addFilesInMA для загрузки файла")
        return axios.post('/catalog.doc2/addFilesInMA',
            JSON.stringify(obj))
            .catch(err => {
                console.log(err);
            })
    }
}

export const getAppsBetweenDocAndUser = (obj) => {
    return (dispatch, getState) => {
        obj.id_user ? obj.id_doc = getState().auth.id : obj.id_user = getState().auth.id;
        return axios.post('/catalog.doc2/allMAbyIdUserAndIdDoc',
            JSON.stringify({
                ...obj,

            }))
            .then(res => {
                dispatch({
                    type: actionTypes.APPS_BETWEEN_DOC_USER,
                    appsBetween: res.data.result,
                    appsBetweenCount: res.data.count
                });
            })
            .catch(err => {
                console.log(err);
            })
    }
};

export const completeReception = (obj) => {
    return dispatch => {
        axios.post('/catalog.doc2/toFinishReception',
            JSON.stringify(obj))
            .then(res => {
                console.log('[completeReception]',JSON.stringify(obj))
                console.log(res.data)
            })
            .catch(err => {
                console.log(err);
        })
    }
}

export const closeTreatment = (id) => {
    return dispatch => {
        console.log('closeTreatment', id)
        axios.get('/catalog.doc2/changeStatus/id/'+id+'/status/completed')
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                console.log(err);
        })
    }
}

export const selectTreatment = (treatId) => {

    return (dispatch) => {
        axios.get('/catalog.doc2/getTreatmentBiId/id/'+treatId)
            .then(res => {
                dispatch({
                    type: actionTypes.SELECT_TREATMENT,
                    treatInfo: {
                        ...res.data.result,
                        id_treatment: treatId,
                    },
                });
            })
            .catch(err => {
                console.log(err);
        })
    }
}

export const uploadChatFile = (id_zap, id_user, file, callback) => {
    return (dispatch) => {
        axios.post('/catalog.doc2/saveFilesChat',
            JSON.stringify({
                id_zap,
                id_user,
                file: [file]
            }))
            .then(res => {
                const {result} = res.data;
                (callback instanceof Function) && result &&  callback(result[0]);
            })
            .catch(err => {
                console.log(err);
        })
    }
}

export const uploadConclusion = (id_zap, file, callback) => {
    return (dispatch) => {
        //console.log(file.thumbUrl.substr(0,50));
        return axios.post('/catalog.doc2/saveFilesZak',
            JSON.stringify({
                id_zap,
                file,
            }))
            .then(res => {
                const {result} = res.data;
                (callback instanceof Function) &&  callback({...result, isConclusion: true});
                return res
            })
    }
}

export const getAllFilesTreatment = (treatId) => {
    return (dispatch) => {
        axios.post('/catalog.doc2/allFilesTreatment',
        JSON.stringify({id: treatId}))
            .then(res => {
                dispatch({
                    type: actionTypes.GET_TREATMENT_FILES,
                    files: res.data,
                })
            })
            .catch(err => {
                console.log(err);
            });
    }
}

export const seletVisit = (visId, callback) => {
    return (dispatch) => {
        axios.get('/catalog.doc2/getInfoByMakingAppId/id/'+visId)
            .then(res => {
                console.log('[seletVisit]',res.data)
                dispatch({
                    type: actionTypes.SELECT_VISIT,
                    visitInfo: res.data,
                    callback: callback,
                });

                //(callback instanceof Function) && callback();
            })
            .catch(err => {
                console.log(err);
            });
    }
}

export const clearSelections = () => {
    return ({
        type: actionTypes.CLEAR_VISIT_AND_TREAT,
    })
}


export const changeReceptionStatus = (id,key) => {

    return (dispatch) => {
        axios.get('/catalog.doc2/addMakingAppTime/id/'+id+'/key/'+key)
            .then(res => {
                key === "finish" && dispatch(getReceptionDuration(id));
            })
            .catch(err => {
                console.log(err);
        })
    }
}

export const getReceptionDuration = (id) => {

    return (dispatch) => {
        axios.get('/catalog.doc2/getMakingAppTimeCost/id/'+id)
            .then(res => {
                const {second, cost} = res.data.result;
                alert('Reception Duration: '+second+'s\nTotal Price: '+cost+"BYN")
            })
            .catch(err => {
                console.log(err);
        })
    }
}

export const clearCallback = () => {
    console.log('clearCallback')
    return ({
        type: actionTypes.CLEAR_CALLBACK,
    });
}
export const cancelAppByPatient = (id) => {

    return (dispatch) => {
        return axios.get('/catalog.doc2/userMakingAppDel/id/'+id)
            .then(res=>{
                dispatch(getCountNearVisits(3));
                dispatch(getAllPatientVisits());
                return res
            })
            .catch(err => {
                console.log(err);
            })
    }
}
