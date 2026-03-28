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
    
    // Add the page code for multi-tenant backend identification
    const pageCode = import.meta.env.VITE_PAGE_CODE || 'bloom';
    config.headers['X-Page-Code'] = pageCode;
    
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

/**
 * Formats a raw address string (which might be a JSON from ShippingAddress)
 * into a human-readable format: "Street Number, CP City, Country"
 */
export const formatAddress = (rawAddress: string | undefined): string => {
    if (!rawAddress) return 'No especificada';
    
    // If it's the fixed pickup address, return as is
    if (rawAddress.includes('Tienda BLOOM') || rawAddress.includes('Recogida')) {
        return rawAddress;
    }

    try {
        const parsed = JSON.parse(rawAddress);
        if (parsed && typeof parsed === 'object' && parsed.street) {
            const { street, houseNumber, postalCode, city, country } = parsed;
            let formatted = street;
            if (houseNumber) formatted += ` ${houseNumber}`;
            if (postalCode || city) formatted += `, ${postalCode} ${city}`;
            if (country && country !== 'ES') formatted += `, ${country}`;
            return formatted;
        }
    } catch (e) {
        // Not a JSON string, return as is (legacy format)
    }

    return rawAddress;
};

