import axios from './axiosSettings'
import * as actionTypes from './actionTypes';


export const getToken = (idUser, amount, price, currency = 'RUB', login = '') => {

    let obj = {
        idUser,
        amount,
        price,
        discipline: 12, // default, when doesn't have discipline
        currency,
        description: `Покупка тренировок в количестве: ${amount}. Логин покупателя ${login}` ,
        test: false
    };

    return (dispatch) => {
        return axios.post('/catalog.fasol/getToken', JSON.stringify(obj))
            .then(res => {
                
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
