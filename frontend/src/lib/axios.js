// src/services/axiosInstance.js
import axios from 'axios';

const publicAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    withCredentials: true, // برای ارسال کوکی refresh token
});


const privateAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    withCredentials: true,

});


export { privateAxios, publicAxios };
