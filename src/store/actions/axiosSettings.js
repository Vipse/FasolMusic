import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://web.fasolonline.ru/~api/json/'
});

export default instance;