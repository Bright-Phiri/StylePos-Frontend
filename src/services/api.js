import axios from "axios";

export default function () {
  const instance = axios.create({
    baseURL: "https://storesapi-6efa26ededb6.herokuapp.com//api/v1/",
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
