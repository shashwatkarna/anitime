import axios from 'axios';

import { Platform } from 'react-native';

// In Expo, EXPO_PUBLIC_ prefixes are automatically exposed to the client
const PRODUCTION_API_URL = process.env.EXPO_PUBLIC_API_URL;

const API_HOST = Platform.select({
    android: '192.168.1.38',
    ios: '192.168.1.38',
    web: 'localhost',
    default: '192.168.1.38',
});

const DEV_API_URL = `http://${API_HOST}:8000/api/v1`;

export const API_URL = PRODUCTION_API_URL || DEV_API_URL;

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const searchAnime = async (query) => {
    const response = await api.get('/anime/search', { params: { q: query } });
    return response.data;
};

export const getPopularAnime = async (limit = 25, filter = null) => {
    const params = { limit };
    if (filter) params.filter = filter;

    const response = await api.get('/anime/popular', { params });
    return response.data;
};

export const calculateWatchTime = async (data) => {
    const response = await api.post('/calculate/', data);
    return response.data;
};
