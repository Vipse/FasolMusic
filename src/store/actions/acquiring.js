import axios from './axiosSettings'
import * as actionTypes from './actionTypes';


export const getToken = (idUser, amount, price, discipline, currency = 'RUB', description = 'Покупка') => {
debugger
    let obj = {
        idUser,
        amount,
        price,
        discipline,
        currency,
        description: description + ' тренировок в количестве: ' + amount,
        test: true
    };

    return (dispatch) => {
        return axios.post('/catalog.fasol/getToken', JSON.stringify(obj))
            .then(res => {
                debugger
                console.log('getToken :', getToken);
                dispatch({
                    type: actionTypes.GET_TOKEN,
                    token: res.data.result.token,
                    redirect_url: res.data.result.redirect_url
                })

                window.location = res.data.result.redirect_url;

                return res;
            })
            .catch(err => {console.log(err);})
    }
}

export const checkToken = (idUser) => {

    return (dispatch) => {
        return axios.post('/catalog.fasol/checkToken', JSON.stringify({idUser}))
            .then(res => {
                dispatch({
                    type: actionTypes.CHECK_TOKEN,
                    checkToken: res.data.result,
                })

                return res.data.result;
            })
            .catch(err => {console.log(err);})
    }
}
