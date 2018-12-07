import axios from './axiosSettings'
import * as actionTypes from './actionTypes';

export const getDocTodayInfo = () => {
    return (dispatch, getState) => {
        axios.get('/catalog.doc2/todayActualZap/id_doc/'+getState().auth.id)
            .then(res => {
                dispatch({
                    type: actionTypes.GET_DOCTOR_TODAY_INFO,
                    todayInfo: res.data.result,                    
                });
            })
            .catch(err => {
                console.log(err);
        })
    }    
}

export const getDocShortInfo = () => {
    return (dispatch, getState) => {
        axios.get('/catalog.doc2/dopInfoDocBiId/id_doc/'+getState().auth.id)
            .then(res => {
                dispatch({
                    type: actionTypes.GET_DOCTOR_SHORT_INFO,
                    info: res.data.result,
                });
            })
            .catch(err => {
                console.log(err);
        })
    }    
}
