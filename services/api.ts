import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__
  ? process.env.EXPO_PUBLIC_ARENAHUB_API_URL
  : 'https://api.arenahub.app/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    // Lista de endpoints públicos que não precisam de autenticação
    const publicEndpoints = [
      '/usuarios/auth',
      '/verify',
      '/forgot-password',
      '/verify-reset-code',
      '/reset-password',
      '/resend-verification'
    ];

    const isPublicEndpoint = publicEndpoints.some(endpoint =>
      config.url?.includes(endpoint)
    );

    if (!isPublicEndpoint) {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para debug de respostas
api.interceptors.response.use(
  async (response) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      response.headers.Authorization = `Bearer ${token}`;
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;