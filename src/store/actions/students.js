import axios from './axiosSettings'
import * as actionTypes from './actionTypes';

export const selectStudent = (id) => {
    return {
        type: actionTypes.SELECT_STUDENT,
        id: id,
    }
};

export const setFreeIntervals = (freeIntervals, discipline ) => {
    return (dispatch) => {
        let obj = { discipline : [] };
        let type = {vocals : '125485', guitar : '125470', fono: '144051'};

        for( let key in type ){
            if(String(key) === discipline){
                obj.discipline.push(type[key]);
            }
        }
        dispatch({
            type: actionTypes.SET_FREE_INTERVALS,
            freeIntervals: freeIntervals,
        });

        console.log("obj", obj);
        axios.post('/catalog.fasol/getMasterList', JSON.stringify({ 'discipline' : [125485, 125470, 144051]}))
            .then((rez) => {
                let masterListObj = {};
                const masterList = rez.data.result.masterlist;
                console.log("RRR", masterList)

                dispatch({
                    type: actionTypes.GET_MASTER_LIST,
                    trainerList: masterList,
                });

                masterList.forEach((el) =>  masterListObj[el.idMaster] = el)

                dispatch({
                    type: actionTypes.GET_MASTER_LIST_OBJ,
                    masterListObj: masterListObj,
                })

            })
            .catch(err => {
                console.log(err);
            })
    }
};

export const setNeedSaveIntervals = (countTraining) => {
    return {
        type: actionTypes.SET_NEED_SAVE_INTERVALS,
        abonementIntervals: { visibleCreateTrainModal: countTraining.visibleCreateTrainModal, countTraining: countTraining.countTraining},
        amountTraining: countTraining.countTraining
    }
};
