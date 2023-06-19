import axios from "axios";

export default function () {
  const instance = axios.create({
    baseURL: "http://192.168.43.111:3000/api/v1/",
  });

  instance.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem("vuex"))?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
}
