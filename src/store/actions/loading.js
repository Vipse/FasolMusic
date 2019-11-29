import * as actionTypes from './actionTypes';
import axios from './axiosSettings'



export const startLoading = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.START_LOADING
        })
    }
};
export const endLoading = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.END_LOADING
        })
    }
};




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

export const getMultipleSelectors = (namesArr) => {
    return (dispatch) => {
        let arr = namesArr.map((name) => dispatch(getSelectors(name))
            .then(res => res)
            .catch(err => err));

        return Promise.all(arr)
            .then(res => {
                return res.every(selectorType => selectorType.data.length);
            })
            .catch(err => {
                console.log('error: ', err);
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

export const getAbonementsPrice = () => {
    return (dispatch) => {
        return axios.post('/catalog.fasol/getContent', JSON.stringify({id: 3783}))
            .then(res => {
                console.log('getAbonementsPrice', res);
                dispatch({
                    type: actionTypes.GET_ABONEMENTS_PRICE,
                    priceList: res.data.result.abonement
                });

                return res;
            })
            .catch(err => {console.log(err)})
    }
};
