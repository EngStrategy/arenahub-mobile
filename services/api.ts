// services/api.ts
import axios from 'axios';

// ⚠️ ALTERE AQUI PARA SEU IP LOCAL
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.0.7:8080/api/v1'  // Desenvolvimento (IP do seu PC)
  : 'https://api.arenahub.app/api/v1'; // Produção

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para debug de requisições
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
    console.log('📦 Data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para debug de respostas
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    console.error('📄 Error Data:', error.response?.data);
    
    // Tratar erro e retornar mensagem apropriada
    const message = 
      error.response?.data?.message || 
      error.response?.data || 
      'Erro ao processar requisição';
    
    return Promise.reject(new Error(message));
  }
);

export default api;