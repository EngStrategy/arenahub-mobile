import api from '@/services/api';

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

export interface ArenaQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  cidade?: string;
  esporte?: 'FUTEBOL_SOCIETY' | 'FUTEBOL_SETE' | 'FUTEBOL_ONZE' | 'FUTSAL' | 'BEACHTENNIS' | 'VOLEI' | 'FUTEVOLEI' | 'BASQUETE' | 'HANDEBOL';
  latitude?: number;
  longitude?: number;
  raioKm?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// ==================== FUNÇÕES DA API ====================

/**
 * Buscar arena por ID
 * Endpoint: GET /api/v1/arenas/{id}
 */
export const getArenaById = async (id: string): Promise<GetArenaResponse> => {
  try {
    const response = await api.get(`/arenas/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('📄 Erro ao buscar arena:', error.response?.data || error.message);
    throw new Error('Erro ao buscar arena');
  }
};

/**
 * Buscar todas as arenas com filtros
 * Endpoint: GET /api/v1/arenas
 */
export const getAllArenas = async (
  params: ArenaQueryParams = {}
): Promise<PaginatedResponse<GetArenaResponse>> => {
  try {
    const response = await api.get('/arenas', { params });
    return response.data;
  } catch (error: any) {
    console.error('📄 Erro ao buscar arenas:', error.response?.data || error.message);
    throw new Error('Erro ao buscar arenas');
  }
};

/**
 * Atualizar arena
 * Endpoint: PUT /api/v1/arenas/{id}
 */
export const updateArena = async (id: string, data: UpdateArenaRequest) => {
  try {
    const response = await api.put(`/arenas/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error('📄 Erro ao atualizar arena:', error.response?.data || error.message);
    throw new Error('Erro ao atualizar arena');
  }
};