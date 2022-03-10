import axios from 'axios';
import Config from '../utils/config';

const BASE_URL = Config.API_URL


export default axios.create({
  baseURL: BASE_URL
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": 'application/json'
  },
  withCredentials: true
})