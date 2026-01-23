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

/**
 * Algumas rotas podem exigir autenticação.
 * Este interceptor adiciona o token JWT ao cabeçalho Authorization.
 * Descomente se precisar dessa funcionalidade.
 * É preciso melhorar essa lógica para lidar com requisições para rotas públicas.
 */

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
    console.log('📦 Data:', config.data);
    console.log('🔑 Token:', token ? 'Presente ✅' : 'Ausente ❌');

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// 💬 Interceptor para debug de respostas
api.interceptors.response.use(
  async (response) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      response.headers.Authorization = `Bearer ${token}`;
    }
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    console.error('📄 Error Data:', error.response?.data);
    return Promise.reject(error);
  }
);

export default api;