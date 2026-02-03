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
    role: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface VerifyCodeRequest {
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
    accessToken: string;
    userId: string;
    name: string;
    role: string;
    imageUrl?: string;
    expiresIn: number;
}