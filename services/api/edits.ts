
import { api } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ==================== INTERFACES ====================

export interface GetArenaResponse {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: {
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    complemento?: string;
    latitude?: number;
    longitude?: number;
  };
  descricao?: string;
  urlFoto: string;
  dataCriacao: string;
  role: string;
  esportes: string[];
  quadras: any;
  notaMedia: number;
  horasCancelarAgendamento?: number;
  quantidadeAvaliacoes: number;
  statusAssinatura: string;
}


export interface UpdateArenaRequest {
  nome: string;
  telefone: string;
  endereco: {
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    complemento?: string;
    latitude?: number;
    longitude?: number;
  };
  horasCancelarAgendamento?: number;
  descricao?: string;
  urlFoto?: string;
}

export interface UpdateArenaResponse {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: {
    cep: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    complemento?: string;
    latitude?: number;
    longitude?: number;
  };
  descricao?: string;
  urlFoto: string;
  dataCriacao: string;
  role: string;
  esportes: string[];
  quadras: any;
  notaMedia: number;
  horasCancelarAgendamento?: number;
  quantidadeAvaliacoes: number;
  statusAssinatura: string;
}

// ==================== FUNÇÕES DA API ====================

/**
 * Buscar arena por ID
 * Endpoint: GET /api/v1/arenas/{id}
 */
export const getArenaById = async (id: string): Promise<GetArenaResponse> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error('Token não encontrado. Faça login novamente.');

    const response = await api.get(`/arenas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('📄 Erro ao buscar arena:', error.response?.data || error.message);
    throw new Error('Erro ao buscar arena');
  }
};

/**
 * Atualizar arena
 * Endpoint: PUT /api/v1/arenas/{id}
 */
export const updateArena = async (id: string, data: UpdateArenaRequest) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error('Token não encontrado. Faça login novamente.');

    const response = await api.put(`/arenas/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('📄 Erro ao atualizar arena:', error.response?.data || error.message);
    throw new Error('Erro ao atualizar arena');
  }
};

