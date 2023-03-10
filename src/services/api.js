import axios from 'axios';

export default function() {
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:3000/api/v1/'
  });

  instance.interceptors.request.use(config => {
    const token = JSON.parse(localStorage.getItem('vuex'))?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
}
