import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://web.fasolonline.ru/~api/json/'
    //baseURL: 'http://178.172.172.2/~api/json/'
});

export default instance;