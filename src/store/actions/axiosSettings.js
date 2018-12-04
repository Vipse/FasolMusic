import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://178.172.172.2/~api/json/'
    //baseURL: 'https://appdoc.by/~api/json/'
});

export default instance;