import axios from 'axios';

export const BACKEND_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: `${BACKEND_URL}/api`
});

// Esto es lógica pura de JS, no lleva etiquetas <div>
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Page-Code'] = import.meta.env.VITE_PAGE_CODE || 'tienda_a';
    return config;
});

export default api;