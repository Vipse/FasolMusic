import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import * as actions from '../actions'
import {message} from 'antd'

export const setParamsId = (params) => { 
    return ({
        type: actionTypes.SET_PARAMS_ID,  
        params   
    });
}

export const getAvailableInterval = (dateStart, dateEnd, discipline, isCallAdmin) => {
    if( !Array.isArray(discipline)) discipline = [discipline]
    let obj =  { dateStart , dateEnd, discipline, isCallAdmin};

    return (dispatch) => {
        dispatch(actions.startLoading())

        return axios.post('/catalog.fasol/getIntervalOnWeekdaysOnlyDate', JSON.stringify(obj))
            .then(rez => {

                    if(!rez.data.error){
                        if(!rez.data.result.interval){
                            message.info('На выбранной неделе нет свободных тренеров - перейди на следующую неделю')       
                        } 
                        else{
                            dispatch({
                                type: actionTypes.GET_AVAILABLE_INTERVAL,
                                freeInterval: rez.data.result.interval,
                            })
                            dispatch({
                                type: actionTypes.SET_WEEKDAYS_AND_DISCIPLINE_AND_ARRMASTERS,
                                masters: rez.data.result.masters
                            })
                        }      
                    }  
                    dispatch(actions.endLoading())        
            })
            .catch(err => {
                console.log(err);
                dispatch(actions.endLoading())
            })
    }
}

export const getTheMasterInterval = (dateStart, dateEnd, idMaster, weekdays, isCallAdmin) => {
    let obj = {
        dateStart,
        dateEnd,
        idMaster,
        weekdays,
        isCallAdmin
    };

    return (dispatch) => {
        return axios.post('/catalog.fasol/getMasterIntervalOnlyDate', JSON.stringify(obj))
            .then(res => {
                
                if(!res.data.error){
                    dispatch({
                        type: actionTypes.GET_THE_MASTER_INTERVAL,
                        freeInterval: res.data.result.interval,
                    })
                    return res;
                }
            })
            .catch(err => console.log(err))
    }
}

export const masterFreeOnDate = (date, chooseMasters) => {

    let obj = {
        date,
        arrMaster: chooseMasters
    };

    return (dispatch) => {
        return axios.post('/catalog.fasol/masterFreeOnDate', JSON.stringify(obj))
            .then(res => {
                dispatch({
                    type: actionTypes.GET_FULL_INFO_MASTERS,
                    fullInfoMasters: res.data.result.masters,
                })
                return res;
            })
            .catch(err => {console.log(err);})
    }
}


export const clearFreeInterval = () => {
    return ({
        type: actionTypes.GET_THE_MASTER_INTERVAL,
        freeInterval: []
    });
}


