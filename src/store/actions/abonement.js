 import axios from './axiosSettings'
import * as actionTypes from './actionTypes';
import {getCountTrainingByDiscipline} from './training';

export const createAbonement = (dataCreate) => {
    console.log("POST abon", dataCreate)

    return (dispatch, getState) => 
        axios.post('/catalog.fasol/createSubscription', JSON.stringify(dataCreate))
            .then(res => {
                console.log("createSubscription", res);
                return res;
            })
            .catch(err => {
                console.log(err);
        })
        
}

export const getAbonementsFilter = (idStudent, currDiscipline, isCallAdmin, isFirst = false) => (dispatch) => {
    const obj = {
        idStudent, 
        pastOnly: false,
        isCallAdmin
    }
    return axios.post('/catalog.fasol/GetSubscriptionsNew', JSON.stringify(obj))
        .then(res => {   
                let fdata = res.data.result;
                const discAbonement = Object.keys(res.data.result);  
                let mainDiscipline = null;  
                if (currDiscipline=="default"){

                    let mas = [];
                    
                    for (let key in fdata){
                      mas.push(fdata[key])
                    }

                    mas = mas.map( item => {
                        return item.filter( item => {
                           if (!item.isComplete && !item.isBooking) return item
                        })
                    })

                    mas = mas.map((item)=>{
                        return {
                            length:item.length,
                            code:item[0].discipline[0].id,
                            name:item[0].discipline[0].value
                        }
                    })

                    let defaultDiscipline = mas.reduce((previousItem, item)=>{
                       if (item.length > previousItem.length) return item
                       else return previousItem
                    })
        
                if (defaultDiscipline.code) mainDiscipline = defaultDiscipline.code;
                }
                else {
                    mainDiscipline = currDiscipline.code;
                }

                if(isFirst) {
                        let countInDiscipline = 0;
                        for( let el in fdata){
                            if(countInDiscipline < fdata[el].length){
                                countInDiscipline = fdata[el].length;
                                mainDiscipline = el;
                            }
                        }
                        mainDiscipline && dispatch({
                            type: actionTypes.CHANGE_CURRENT_DISCIPLINE,
                            currDiscipline : mainDiscipline,
                        });
                }

                if(fdata.hasOwnProperty(mainDiscipline)){
                    fdata[mainDiscipline].map((el) => {  
                        el.fio = '#'+el.key + ' ' + el.masterFio ? el.masterFio : '';
                        el.start = new Date(+el.start * 1000);
                        el.discipline = el.discipline.map( elem => elem.name).join(',')
                        el.comment = 'comment';
                        el.idMaster = el.idMaster;
                        el.isBooking = el.isBooking;      
                    })
                    fdata = fdata[mainDiscipline] /* .filter((el) => !el.isBooking); */ // remove booking training
                }  
                
                dispatch({
                    type: actionTypes.GET_ABONEMENTS,
                    allAbonements: fdata  ,
                });

                dispatch({
                    type: actionTypes.SET_DISC_ABONEMENT,
                    discAbonement : discAbonement,
                });    
                
                dispatch(getCountTrainingByDiscipline(idStudent, mainDiscipline))
                
        })
        .catch(err => {
            console.log(err);
        })
    
}

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

export const transferTrainining = (value, isCallAdmin) =>  {
    return (dispatch, getState) => 
        
        axios.post('/catalog.fasol/transferTrainining', JSON.stringify({...value, isCallAdmin}))
            .then(res => {               
                console.log("transferTrainining", res);
            })
            .catch(err => {
                console.log(err);
        })
        
}

export const transferTraininingToEnd = (value, isCallAdmin) => {

    return (dispatch, getState) => 
        axios.post('/catalog.fasol/TransferTraininingToEnd', JSON.stringify({...value, isCallAdmin}))
            .then(res => {

                console.log("TransferTraininingToEnd", res);
                
                return res;
            })
            .catch(err => {
                console.log(err);
        })
        
}

export const changeSubscription = (value, isCallAdmin) => {


console.log('changeSubscription', value)
    return (dispatch, getState) => 
        axios.post('/catalog.fasol/changeSubscription', JSON.stringify({...value, isCallAdmin}))
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


export const freezeAbonement = (idSubscription,idUser) => {
    const obj = idUser ? {
        idSubscription,
        idUser
    } : {
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
                return res;
            })
            .catch(err => {
                console.log(err);
        })
        
}

export const getSubscriptionsByStudentId = (idStudent) => {

    return (dispatch, getState) => 
        axios.post('/catalog.fasol/getSubscriptionsByStudentId', JSON.stringify({idStudent}))
            .then(res => {
                dispatch({
                    type: actionTypes.GET_SUBSCRIPTION_FOR_DISCIPLINE,
                    subsForDisc: res.data.result,
                });
                return res;
            })
            .catch(err => {
                console.log(err);
        })
        
}
export const getStudentBalance = (idStudent) => {

    return (dispatch, getState) => 
        axios.post('/catalog.fasol/getStudentBalance', JSON.stringify({idStudent}))
            .then(res => {
                
                dispatch({
                    type: actionTypes.GET_STUDENT_BALANCE,
                    studentBalance: res.data.balance,
                });
                return res;
            })
            .catch(err => {
                console.log(err);
        })
        
}

export const getUserFono = (idTo) => {

    return (dispatch, getState) => 
        axios.post('/catalog.fasol/getUserFono', JSON.stringify({idUser: idTo}))
            .then(res => {
                console.log("getUserFono", res);
                dispatch({
                    type: actionTypes.GET_USER_FONO,
                    toUserFono: res.data.result,
                });
                sessionStorage.setItem("_id-fono", res.data.result)
                return res;
            })
            .catch(err => {
                console.log(err);
        })
        
}



export const isPushBtnUnfresh = () => {
    
    return ({
        type: actionTypes.IS_PUSH_BTN_UNFRESH  
    });
}

export const changePushBtnUnfresh = (isPushBtnUnfresh) => {
    
    return ({
        type: actionTypes.CHANGE_PUSH_BTN_UNFRESH,  
        isPushBtnUnfresh

    });
}


export const setWeekInterval = (interval) => {
    
    return ({
        type: actionTypes.SET_WEEK_INTERVAL,
        weekInterval: interval            
    });
}

export const changeCurrDiscipline = (currDiscipline) => {
    

    return ({
        type: actionTypes.CHANGE_CURRENT_DISCIPLINE,
        currDiscipline: currDiscipline            
    });
}

export const setChooseTheMasterByStudent = (master) => {
    
    return ({
        type: actionTypes.SET_CHOOSE_THE_MASTER_BY_STUDENT,
        chooseTheMaster: master            
    });
}

