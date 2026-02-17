import axios from 'axios';

import { Platform } from 'react-native';

// Use your computer's local IP address for Expo Go on physical devices
// This matches the Metro bundler IP shown in the terminal
const API_HOST = Platform.select({
    android: '192.168.1.38',  // For Expo Go on physical Android device
    ios: '192.168.1.38',      // For Expo Go on physical iOS device
    web: 'localhost',
    default: '192.168.1.38',
});

export const API_URL = `http://${API_HOST}:8000/api/v1`;

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
