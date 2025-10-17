import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.29.244:3000/api',
  withCredentials: true,
});

export default api;
