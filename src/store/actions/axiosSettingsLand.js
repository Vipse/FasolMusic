import axios from 'axios'

const instanceLand = axios.create({
    //baseURL: 'http://178.172.172.2/~api/json/'
    baseURL: `https://web.fasolstudio.by/`
});

export default instanceLand;