import axios from './axiosSettings'
import * as actionTypes from './actionTypes';


export const getToken = (idUser, amount, price, discipline, currency= 'BYN', description = 'Покупка') => {
   
    let obj = {
        idUser, 
        amount,
        price,
        discipline,
        currency,
        description,
    };

    return (dispatch) => {
        return axios.post('/catalog.fasol/getToken', JSON.stringify(obj))
            .then(res => {
                debugger;
                dispatch({
                    type: actionTypes.GET_TOKEN,
                    token: res.data.result.token,
                    redirect_url: res.data.result.redirect_url
                })
                window.open(res.data.result.redirect_url);
                console.log('window :', window);
                return res;
            })
            .catch(err => {console.log(err);})
    }
}

