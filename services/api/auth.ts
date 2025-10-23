// services/api/auth.ts
import axios from 'axios';

const API_URL = 'http://192.168.0.5:8080/api/v1';

// Criar instância do axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors para debug
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

api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    console.error('📄 Error Data:', error.response?.data);
    return Promise.reject(error);
  }
);

// ==================== INTERFACES ====================

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmation: string;
}

// ==================== FUNÇÕES DA API ====================

/**
 * Solicitar reset de senha
 * Endpoint: POST /api/v1/forgot-password
 * @param email Email do usuário
 */
export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  } catch (error: any) {
    const message = 
      error.response?.data?.message || 
      error.response?.data || 
      'Erro ao enviar email';
    throw new Error(message);
  }
};

/**
 * Verificar código de reset
 * Endpoint: POST /api/v1/verify-reset-code
 * @param email Email do usuário
 * @param code Código de 6 dígitos
 */
export const verifyResetCode = async ({ email, code }: VerifyResetCodeRequest) => {
  try {
    const response = await api.post('/verify-reset-code', { email, code });
    return response.data;
  } catch (error: any) {
    const message = 
      error.response?.data?.message || 
      error.response?.data || 
      'Código inválido ou expirado';
    throw new Error(message);
  }
};

/**
 * Redefinir senha
 * Endpoint: POST /api/v1/reset-password
 * @param email Email do usuário
 * @param newPassword Nova senha
 * @param confirmation Senhas coincidem
 */
export const resetPassword = async ({ email, newPassword, confirmation }: ResetPasswordRequest) => {
  try {
    const response = await api.post('/reset-password', { 
      email, 
      newPassword,
      confirmation 
    });
    return response.data;
  } catch (error: any) {
    const message = 
      error.response?.data?.message || 
      error.response?.data || 
      'Erro ao redefinir senha';
    throw new Error(message);
  }
};

/**
 * Reenviar código de verificação
 * Endpoint: POST /api/v1/resend-verification
 * @param email Email do usuário
 */
export const resendVerificationCode = async (email: string) => {
  try {
    const response = await api.post('/resend-verification', { email });
    return response.data;
  } catch (error: any) {
    const message = 
      error.response?.data?.message || 
      error.response?.data || 
      'Erro ao reenviar código';
    throw new Error(message);
  }
};

export default api;