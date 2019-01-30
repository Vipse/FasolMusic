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


export const getAbonementsFilter = (idStudent, currDiscipline) => (dispatch) => {
    
    axios.post('/catalog.fasol/GetSubscriptionsNew', JSON.stringify({'idStudent': idStudent,  "pastOnly": false}))
        .then(res => {
            console.log("GetSubscriptions", res);
            console.log("currDiscipline", currDiscipline);
            res.data.result[currDiscipline.code].map((el) => {
                el.fio = '#'+el.key;
                el.start = new Date(+el.start * 1000);
                el.discipline = el.discipline.map( elem => elem.name).join(',')
                el.comment = 'comment';
            })

            dispatch({
                type: actionTypes.GET_ABONEMENTS,
                allAbonements: res.data.result[currDiscipline.code],
            });
        })
        .catch(err => {
            console.log(err);
    })
    
}


// export const getAbonements = (idStudent, currDiscipline) => (dispatch) => {

//         axios.post('/catalog.fasol/GetSubscriptions', JSON.stringify({'idStudent': idStudent,  "pastOnly": false}))
//             .then(res => {
//                 console.log("GetSubscriptions", res);

//                 let arrAbonement = null;
//                 let {subscriptions} = res.data.result;
//                 let iterator = 1;

//                     if(subscriptions){
//                         arrAbonement = [];
//                         const max = subscriptions.length;
//                         for(let i = 0; i < max; i++){
//                             if(!subscriptions[i].discipline.every((el) => {
                                
//                                 return +el.id === currDiscipline.code 
//                             })) continue;

//                             for(let j = 0; j < subscriptions[i].training.length; j++){

//                                 arrAbonement.push(
//                                     {
//                                         id:             subscriptions[i].training[j].id,
//                                         avatar:         "https://appdoc.by/media/userDocuments/avatars/3095/IMG_4788.JPG",
//                                         fio:            'Дисциплина - ' + subscriptions[i].discipline.map((el) => el.name) + ' #'+ (j+1),
//                                         idMaster:       subscriptions[i].training[j].idMaster,
//                                         discipline:     'Дисциплина - ' + subscriptions[i].discipline.map((el) => el.name) + ' #'+ (j+1),
//                                         comment:        "Строгий полицейский",
//                                         start:          new Date(subscriptions[i].training[j].start * 1000),
//                                         status:         subscriptions[i].training[j].status,
//                                         isBooking:      subscriptions[i].training[j].isBooking,

//                                         idSubscription: subscriptions[i].idSubscription, // для поиска
//                                     })
//                             }
//                         }
                        
//                     }

//                 dispatch({
//                     type: actionTypes.GET_ABONEMENTS,
//                     allAbonements: arrAbonement,
//                 });
//             })
//             .catch(err => {
//                 console.log(err);
//         })
        
// }


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
                return res;
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
                return res;
            })
            .catch(err => {
                console.log(err);
        })
        
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

