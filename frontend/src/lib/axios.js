// src/services/axiosInstance.js
import axios from 'axios';

const publicAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, 
});


const privateAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});


export { privateAxios, publicAxios };
