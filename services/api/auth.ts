import { api } from '../api';

// ==================== INTERFACES ====================

export interface RegisterAthleteRequest {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
}

export interface RegisterAthleteResponse {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  urlFoto?: string;
  dataCriacao: string;
  role: string; // geralmente "ATLETA"
}

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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// ==================== FUNÇÕES DA API ====================

/**
 * Cadastrar novo atleta
 * Endpoint: POST /api/v1/atletas
 * @param data Dados do atleta (nome, email, telefone, senha)
 */
export const registerAthlete = async (data: RegisterAthleteRequest): Promise<RegisterAthleteResponse> => {
  try {
    const response = await api.post<RegisterAthleteResponse>('/atletas', data);
    return response.data; // 201
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error('Dados inválidos fornecidos');
    } 
    if (error.response?.status === 409) {
      throw new Error('Email ou telefone já cadastrado');
    }
    const message = error.response?.data?.message || error.response?.data || 'Erro ao cadastrar atleta';
    throw new Error(message);
  }
};

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
 * @param confirmation Confirmação da senha
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

/**
 * Autenticar usuário
 * Endpoint: POST /api/v1/usuarios/auth
 * @param email Email do usuário
 * @param password Senha do usuário
 */
export const login = async ({ email, password }: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/usuarios/auth', { 
      email, 
      password 
    });
    return response.data;
  } catch (error: any) {
    const message = 
      error.response?.data?.message || 
      error.response?.data || 
      'Email ou senha inválidos';
    throw new Error(message);
  }
};