import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__
  ? process.env.EXPO_PUBLIC_ARENAHUB_API_URL
  : process.env.EXPO_PUBLIC_ARENAHUB_API_URL_PROD;

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
      '/resend-verification',
      '/jogos-abertos',
      '/arenas'
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

// Callback para logout quando receber 401
let logoutCallback: (() => void) | null = null;

export const registerLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

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
    // Se receber 401 (Unauthorized), desloga o usuário
    if (error.response && error.response.status === 401) {
      if (logoutCallback) {
        logoutCallback();
      }
    }
    return Promise.reject(error);
  }
);

export default api;