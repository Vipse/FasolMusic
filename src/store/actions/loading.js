import * as actionTypes from './actionTypes';
import axios from './axiosSettings'


export const loadingStart = (loader) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.LOADING_START,
            loader: loader
        })
    }
};
export const loadingEnd = (loader) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.LOADING_END,
            loader: loader
        })
    }
};

export const docEmergancyCallSend = () => {
    return (dispatch, getState) => {
        axios.get('/catalog.doc2/docTakeMakinAppFromAll/id_doc/' + getState().auth.id)
            .then(res => {
                res.data.code === 200 ?
                    dispatch(docEmergancyCallReceived(res.data.result.id_makingApp,true))
                    : dispatch(docEmergancyCallReceived(0, false));
            })
            .catch(err => {
                console.log(err);
        });
    }
};
export const docEmergancyCallReceived = (visitId, isConfirmed) => {
    return {
        type: actionTypes.DOC_EMERGANCY_REQUEST_RECEIVED,
        visitId,
        isConfirmed,
    }
};

export const docEmergancyCallReceivedMark = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.DOC_EMERGANCY_RECEIVED_MARK,
        })
    }
};

export const makeArchiveOfFiles = (obj) => {
    return (dispatch, getState) => {
        const files = {
            id: getState().auth.id,
            data: obj
        };
        console.log("WHAT WE SEND TO MAKE FILES", files);
        return axios.post('/catalog.doc2/getArchive/id_doc/', JSON.stringify(files))
            .then(res => res)
            .catch(err => {
                console.log(err);
            });
    }
};

export const getSelectors = (name) => {
    return (dispatch) => {
        const selectorNameObj = {
            code: name
        };

        return axios.post('/catalog.fasol/getSelectors',
            JSON.stringify(selectorNameObj))
            .then(res => {
                dispatch({
                    type: actionTypes.GET_SELECTORS,
                    selectorType: name,
                    values: res.data
                });

                return res;
            })
            .catch(err => {
                console.log('error: ', err);
                return err;
            })
    }
};

export const searchUsers = (name) => {
    return (dispatch, getState) => {
        let obj = {
            inputText: name,
            typePeople: getState().auth.mode
        };

        axios.post('/catalog.fasol/searchUser', JSON.stringify(obj))
            .then(rez => {
                dispatch({
                    type: actionTypes.GET_RESULTS_HEADER_SEARCH,
                    usersHeaderSearch: rez.data.result.interval,
                })
            })
            .catch(err => {
                console.log(err);
                return err;
            })
    }
};

export const getNotifications = (id) => {
    const obj = {id};

    return (dispatch) => {
        axios.post('/catalog.fasol/connect',
            JSON.stringify(obj))
            .then(res => {
                console.log('getNotifications', res)
            })
            .catch(err => {
                console.log(err);
            })
    }
};

export const readNotification = (id) => {
    const obj = {id};

    return (dispatch) => {
        axios.post('/catalog.fasol/isreadMessInDB',
            JSON.stringify(obj))
            .then(res => {
                console.log('readNotification', res)
            })
            .catch(err => {
                console.log(err);
            })
    }
};

export const getPromoList = (id) => {
    const obj = {id};

    return (dispatch) => {
        return axios.post('/catalog.fasol/getNewsList', JSON.stringify(obj))
            .then(res => {
                console.log('getNewsList', res);
                dispatch({
                    type: actionTypes.GET_PROMO_LIST,
                    promoList: res.data.result,
                });

                return res;
            })
            .catch(err => {console.log(err)})
    }
};

export const getUserCountry = () => {
    return (dispatch) => {
        return axios.post('/catalog.fasol/thisCountryByIP', JSON.stringify({}))
            .then(res => {
                console.log('thisCountryByIP', res);
                dispatch({
                    type: actionTypes.GET_USER_COUNTRY,
                    country: res.data.country
                });
                return res;
            })
            .catch(err => {console.log(err)})
    }
};
