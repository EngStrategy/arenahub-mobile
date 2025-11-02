import { api } from '../api';

// ==================== INTERFACES ====================

export interface GetArenaResponse {
  id: string;
  nome: string;
  telefone: string;
  descricao?: string;
  horasCancelarAgendamento?: number;
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
}

export interface UpdateArenaRequest {
  nome: string;
  telefone: string;
  descricao?: string;
  horasCancelarAgendamento?: number;
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
}

export interface UpdateArenaResponse extends GetArenaResponse {}

// ==================== FUNÇÕES DA API ====================

/**
 * Buscar arena por ID
 * Endpoint: GET /api/v1/arenas/{id}
 */
export const getArenaById = async (id: string): Promise<GetArenaResponse> => {
  try {
    const response = await api.get<GetArenaResponse>(`/arenas/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Arena não encontrada');
    }
    const message = error.response?.data?.message || error.response?.data || 'Erro ao buscar arena';
    throw new Error(message);
  }
};

/**
 * Atualizar arena
 * Endpoint: PUT /api/v1/arenas/{id}
 */
export const updateArena = async (id: string, data: UpdateArenaRequest): Promise<UpdateArenaResponse> => {
  try {
    const response = await api.put<UpdateArenaResponse>(`/arenas/${id}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error('Dados inválidos fornecidos');
    }
    if (error.response?.status === 404) {
      throw new Error('Arena não encontrada');
    }
    const message = error.response?.data?.message || error.response?.data || 'Erro ao atualizar arena';
    throw new Error(message);
  }
};
