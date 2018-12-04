// import axios from './axiosSettings'

import axios from 'axios'
import * as actionTypes from './actionTypes';

const instance2 = axios.create({
    baseURL: 'http://178.172.172.2/~api/json/'
});



export const createAbonement = (dataCreate) => {
    console.log('POST dataCreate :', dataCreate);

    return (dispatch, getState) => 

        instance2.post('/catalog.fasol/createSubscription', JSON.stringify(dataCreate))
            .then(res => {
                console.log("createSubscription", res);
                // dispatch({
                //     type: actionTypes.GET_DOCTOR_SHORT_INFO,
                //     info: res.data.result,
                // });
            })
            .catch(err => {
                console.log(err);
        })
        
}

export const getAbonements = (idStudent) => {
    idStudent = 1234;
    return (dispatch, getState) => {

        instance2.post('/catalog.fasol/GetSubscriptions', JSON.stringify({'idStudent': '1234',  "pastOnly": false}))
            .then(res => {
                console.log("GetSubscriptions", res);
                dispatch({
                    type: actionTypes.GET_ABONEMENTS,
                    allAbonements: res.data.result,
                });
            })
            .catch(err => {
                console.log(err);
        })
    }    
}


// сделать нормально нужно
export const getAbonements2 = (idStudent) => {
    idStudent = 1234;
    return (dispatch, getState) => {

        instance2.post('/catalog.fasol/GetSubscriptions', JSON.stringify({'idStudent': '1234',  "pastOnly": true}))
            .then(res => {
                console.log("GetSubscriptions", res);
                dispatch({
                    type: actionTypes.GET_ABONEMENTS2,
                    allAbonements2: res.data.result,
                });
            })
            .catch(err => {
                console.log(err);
        })
    }    
}

export const transferTrainining = (value) => {
    console.log('value :', value);
    return (dispatch, getState) => 

        instance2.post('/catalog.fasol/transferTrainining', JSON.stringify(value))
            .then(res => {
                console.log("transferTrainining", res);
                // dispatch({
                //     type: actionTypes.GET_ABONEMENTS2,
                //     allAbonements2: res.data.result,
                // });
            })
            .catch(err => {
                console.log(err);
        })
        
}

export const transferTraininingToEnd = (value) => {
    console.log('value :', value);
    return (dispatch, getState) => 

        instance2.post('/catalog.fasol/TransferTraininingToEnd', JSON.stringify(value))
            .then(res => {
                console.log("TransferTraininingToEnd", res);
                // dispatch({
                //     type: actionTypes.GET_ABONEMENTS2,
                //     allAbonements2: res.data.result,
                // });
            })
            .catch(err => {
                console.log(err);
        })
        
}

export const changeSubscription = (value) => {
    console.log("changeSubscription1", value);
    value.amount = '10';
    return (dispatch, getState) => 
   
        instance2.post('/catalog.fasol/changeSubscription', JSON.stringify(value))
            .then(res => {
                console.log("changeSubscription", res);
                // dispatch({
                //     type: actionTypes.GET_ABONEMENTS2,
                //     allAbonements2: res.data.result,
                // });
            })
            .catch(err => {
                console.log(err);
        })
        
}
