import axios from "axios";

export default function () {
  const instance = axios.create({
    baseURL: "https://clothingretailapi-01cbc9688440.herokuapp.com/api/v1/",
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
