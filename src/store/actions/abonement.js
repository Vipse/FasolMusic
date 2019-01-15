 import axios from './axiosSettings'
import * as actionTypes from './actionTypes';


export const createAbonement = (dataCreate) => {
    
    let type = {vocals : '125485', guitar : '125470'};
  
    for( let key in type ){
        if(String(key) === dataCreate.discipline){
            dataCreate.discipline =  [ type[key] ];
            
        }
    }

    console.log("POST abon", dataCreate)
    return (dispatch, getState) => 

        axios.post('/catalog.fasol/createSubscription', JSON.stringify(dataCreate))
            .then(res => {
                console.log("createSubscription", res);
                // dispatch({
                //     type: actionTypes.GET_DOCTOR_SHORT_INFO,
                //     info: res.data.result,
                // });
                return res;
            })
            .catch(err => {
                console.log(err);
        })
        
}

export const getAbonements = (idStudent) => (dispatch) => {

        // let type = {vocals : '125485', guitar : '125470'};
    
        // for( let key in type ){
        //     if(String(key) === dataCreate.discipline){
        //         dataCreate.discipline =  [ type[key] ];
                
        //     }
        // }

        axios.post('/catalog.fasol/GetSubscriptions', JSON.stringify({'idStudent': idStudent,  "pastOnly": false}))
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


// сделать нормально нужно
export const getAbonements2 = (idStudent) => (dispatch) => {

        axios.post('/catalog.fasol/GetSubscriptions', JSON.stringify({'idStudent': idStudent,  "pastOnly": true}))
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

export const transferTrainining = (value) =>  {
    console.log('value :', value);
    return (dispatch, getState) => 

        axios.post('/catalog.fasol/transferTrainining', JSON.stringify(value))
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
        axios.post('/catalog.fasol/TransferTraininingToEnd', JSON.stringify(value))
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

export const changeSubscription = (value, amountTraining) => {
    console.log("changeSubscription1", value);
    value['amount'] = amountTraining;
    return (dispatch, getState) => 
        axios.post('/catalog.fasol/changeSubscription', JSON.stringify(value))
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


export const freezeAbonement = (idSubscription) => {
    const obj = {
        idSubscription
    }
    return (dispatch, getState) => 
        axios.post('/catalog.fasol/frozenTraining', JSON.stringify(obj))
            .then(res => {
                console.log("frozenTraining", res);
                // dispatch({
                //     type: actionTypes.GET_ABONEMENTS2,
                //     allAbonements2: res.data.result,
                // });
            })
            .catch(err => {
                console.log(err);
        })
        
}


