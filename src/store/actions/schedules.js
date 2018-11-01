import axios from './axiosSettings'
import * as actionTypes from './actionTypes'
import moment from "moment";




export const addInterval = (interval, start, end) => {
    return (dispatch, getState) => {
        let obj = {
            ...interval,
            id_doc: getState().auth.id,
            isEditable: 1,
        }

        axios.post('/catalog.doc2/dateWorkInterval',
                    JSON.stringify(obj))
            .then(res => {
                start && dispatch(getAllIntervals(start,end))
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const getAllIntervals = (start, end) => {
    


    return (dispatch, getState) => {
        let obj = {
            id_doc: getState().auth.id,
            datestart: start.getTime()/1000,
            dateend: end.getTime()/1000,
        };
        axios.post('/catalog.doc2/getDateWorkInterval',
                    JSON.stringify(obj))
            .then(res => {
                console.log('[getAllIntervals]',res.data.result)
                dispatch({
                    type: actionTypes.GET_ALL_INTERVALS,
                    intervals: res.data.result,
                })
            })
            .catch(err => {
                console.log(err);
            });
    }
}

export const getFreeVisitsBySpec = (spec) => {
    return (dispatch, getState) => {

        return axios.post('/catalog.doc2/getFreeDoc',
                    JSON.stringify({speciality: spec}))
            .then(res => {
                console.log('[ALL FREE INTERVALS]',res.data.result)
                dispatch({
                    type: actionTypes.GET_INTERVALS_FOR_FREE_VISITS,
                    intervals: res.data.result,
                });
                return res;
            })
            .catch(err => {
                console.log(err);
            });
    }
};

export const clearIntervals = () => {
    return ({
        type: actionTypes.CLEAR_INTERVALS,
    })
}

export const clearVisits = () => {
    return ({
        type: actionTypes.CLEAR_VISITS,
    })
}

export const addVisit = (reception, start, end, isToday) => {
    return (dispatch, getState) => {
        let obj = {
            ...reception,
            
            id_doc: getState().auth.id,
        };

        if(getState().auth.mode === "doc") {
            obj.id_doc = getState().auth.id;
            obj.id_user = reception.id || reception.id_user;
        } else {
            obj.id_user = getState().auth.id;
            obj.id_doc = reception.id || reception.id_user;
        }
        return axios.post('/catalog.doc2/makingApp',
                    JSON.stringify(obj))
            .then(res => {
                dispatch({
                    type: actionTypes.SET_RECEPTION,
                    isReceptionRecorded: res.data.code === 200,
                    receptionRecordedID: res.data.code === 200 ? res.data.id : moment().format('x')
                });
                start && dispatch(getAllVisits(start,end));
                isToday && dispatch(getTodayVisits());
                return res
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const getAllVisits = (start, end) => {
    
    return (dispatch, getState) => {
        let obj = {
            id_doc: getState().auth.id,
            datestart: start.getTime()/1000,
            dateend: end.getTime()/1000,
        }
        axios.post('/catalog.doc2/getApp',
                    JSON.stringify(obj))
            .then(res => {
                dispatch({
                    type: actionTypes.GET_ALL_VISITS,
                    visits: res.data.result,
                    intervals: res.data.interval.interval,
                    min: 1540875600, //res.data.interval.min, почему начало приходит с сервера
                    max: 1540929600 //res.data.interval.max,
                })
            })
            .catch(err => {
                console.log(err);
            });
    }
};
export const getAllPatientVisits = () => {

    return (dispatch, getState) => {
        let obj = {
            id_user: getState().auth.id,
        };
        axios.post('/catalog.doc2/getApp',
                    JSON.stringify(obj))
            .then(res => {
                dispatch({
                    type: actionTypes.GET_ALL_USER_VISITS,
                    allUserVisits: res.data.result,

                })
            })
            .catch(err => {
                console.log(err);
            });
    }
};

export const getCountNearVisits = (count) => {

    return (dispatch, getState) => {
        let obj = {
            id_user: getState().auth.id,
            max: count,
            datestart: moment().format('X')
        };
        axios.post('/catalog.doc2/getApp',
                    JSON.stringify(obj))
            .then(res => {
                dispatch({
                    type: actionTypes.GET_COUNT_NEAR_VISITS,
                    nearVisits: res.data.result,
                })
            })
            .catch(err => {
                console.log(err);
            });
    }
}

export const getTodayVisits = () => {
    return (dispatch, getState) => {
        axios.get('/catalog.doc2/todayZap/id_doc/'+getState().auth.id)
            .then(res => {
                dispatch({
                    type: actionTypes.GET_ALL_VISITS,
                    visits: res.data.result,
                })
            })
            .catch(err => {
                console.log(err);
            });
    }
}

export const deleteEvent = () => {

    return (dispatch, getState) => {
        
        axios.post('/catalog.doc2/delApp',
                    JSON.stringify({
                        id: getState().schedules.chosenData.id,
                    }))
            .then(res => {
                dispatch({
                    type: actionTypes.DELETE_EVENT,
                })
            })
            .catch(err => {
                console.log(err);
            });
    }
};

export const cancelEventsRange = (obj) => {
    let response = {
        ...obj,
        id_doc: 2697,
    }
    
    return (dispatch) => {
        axios.post('/catalog.doc2/delAppDateInterval',
                JSON.stringify(response))
        .then(res => {
            dispatch({
                type: actionTypes.CLOSE_CANCEL_MODAL,
            })
        })
        .catch(err => {
            console.log(err);
        });
    }
  };


// --------------- old. REFACTOR!!!

export const selectEvent = (event) => {
    return {
        type: actionTypes.SELECT_EVENT,
        event: event
    }
};
