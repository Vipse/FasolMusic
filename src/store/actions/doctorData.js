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
    const idstr = String(id);
    let ids = {"id":idstr}; //задать самому id доктора
    return (dispatch) => {

        return axios.post('/catalog.fasol/getUserInfo',
         JSON.stringify(ids))
            .then(res => {
                console.log("receivedCoachData", res);
                res.data.result.data.id = ids.id;

                dispatch({
                    type: actionTypes.INFO_DOCTOR,
                    profileDoctor: res.data.result.data,
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
};

export const getNotifications = (id) => {
    return (dispatch) => {
        axios.get('/catalog.doc2/connect/id/' + id)
            .then(res => {
                console.log('getNotifications', res)
            })
            .catch(err => {
                console.log(err);
        })
    }
}

export const readNotification = (id) => {
    return (dispatch, getState) => {
        console.log('read',id);
        axios.get('/catalog.doc2/isreadMessInDB/id/' + id)
            .then(res => {
                console.log('readNotification', res)
            })
            .catch(err => {
                console.log(err);
        })
    }
}

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
    return axios.post('https://appdoc.by/upload.php', data)
      .then(res => {
        return res
      })
      .catch(err => {
        console.log(err);
      })
  }
};
