import axios from './axiosSettings'
import * as actionTypes from './actionTypes';

import moment from "moment";

const getInfoMasters = (idMaster) => {
        let obj = {id : '3420'};

        return axios.post('/catalog.fasol/getUserInfo', JSON.stringify(obj))
            .then(rez => rez.data.result.data)
            .catch(err => {
                console.log(err);
            })
    
}

export const getMyMasters = (idStudent) => {
    return (dispatch) => {
        let obj = { idStudent };

        axios.post('/catalog.fasol/getMyMastersOrStudents', JSON.stringify(obj))
            .then(rez => {

                let arr = [];
                rez.data.result.result.forEach(el => {
                    arr.push(getInfoMasters(el.idMaster)
                        .catch((err) => { console.log(err)}));
                });
                          
                return Promise.all(arr)
                    .then((rez) => {
                            dispatch({
                                type: actionTypes.GET_MY_MASTERS,
                                myCoach: rez,
                            })
                    })
                    .catch((err) => {
                        console.log(err)
                    });
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const getDeadlinePay = (idStudent) => {
    let obj =  { idStudent };

    return (dispatch) => {
       
        axios.post('/catalog.fasol/getDeadlinePay', JSON.stringify(obj))
            .then(rez => {
                dispatch({
                    type: actionTypes.GET_DEADLINE_PAY,
                    deadlinePay: rez.data.result.result,
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
}