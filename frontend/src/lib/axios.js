// src/services/axiosInstance.js
import axios from 'axios';

const publicAxios = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
    withCredentials: true,
});


const privateAxios = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
    withCredentials: true,
});


export { privateAxios, publicAxios };
