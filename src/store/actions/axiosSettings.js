import axios from 'axios'

const instance = axios.create({
    baseURL: `${window.location.origin}/~api/json/`
});

export default instance;