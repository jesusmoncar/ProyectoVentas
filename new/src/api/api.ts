import axios from 'axios';

export const BACKEND_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: `${BACKEND_URL}/api`
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;



export const getImageUrl = (image: any, productId?: number) => {
    if (!image) return '';
    
    // Extract path from string or object { url, filename }
    const path = typeof image === 'string' ? image : (image.url || image.filename || '');
    if (!path) return '';

    // If it's already a full URL (Cloudinary, etc.), return as is
    if (path.startsWith('http')) return path;
    
    // If it's a relative path starting with /uploads, it's served by the backend root
    if (path.startsWith('/uploads')) {
        return `${BACKEND_URL}${path}`;
    }

    // Legacy fallback for relative files without /uploads prefix
    if (productId && path) {
        return `${BACKEND_URL}/api/products/${productId}/images/${path}`;
    }

    return path;
};
