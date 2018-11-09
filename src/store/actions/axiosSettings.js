import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://appdoc.by/~api/json/'
});

export default instance;