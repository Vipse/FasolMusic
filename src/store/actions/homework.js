import * as actionTypes from './actionTypes';
import axios from './axiosSettings';


export const getTrainingHistoryList = (idUser, search = '') => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.SET_LOADING_STATUS,
            status: true,
            search
        });

        const { nextRequestNum, maxAmountRequest } = getState().homework;
        const obj = {
            idUser,
            startNum: nextRequestNum * maxAmountRequest,
            maxAmount: maxAmountRequest,
            search
        };

        axios.post('/catalog.fasol/getTrainingHistoryList', JSON.stringify(obj))
            .then(res => {
                console.log('getTrainingHistoryList', res);

                if (res && res.data && !res.data.error)
                    dispatch({
                        type: actionTypes.GET_TRAINING_HISTORY_LIST_SUCCESS,
                        trainingsArr: res.data.result.result
                    });
                else
                    dispatch({
                        type: actionTypes.GET_TRAINING_HISTORY_LIST_FAILED,
                        error: res.data.error,
                    });
            })
            .catch(err => {
                console.log(err);
            });
    }
};

export const changeRequestMaxAmount = (amount) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.CHANGE_MAX_AMOUNT,
            amount
        });
    }
};

export const resetTrainingHistoryList = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.RESET_TRAINING_HISTORY_LIST
        });
    }
};
