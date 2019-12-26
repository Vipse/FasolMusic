import axios from 'axios'
import {baseURL} from '../../hosts.js'

const instance = axios.create({ baseURL });

export default instance;