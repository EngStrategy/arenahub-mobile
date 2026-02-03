import { Arena, ArenaQueryParams, Cidade } from '@/types/Arena';
import { api } from '@/services/api';
import { PaginatedResponse } from '@/types/General';

export const getArenaById = async (id: string): Promise<Arena> => {
  const response = await api.get(`/arenas/${id}`);
  return response.data;
};

/**
 * Buscar todas as arenas com filtros
 * Endpoint: GET /api/v1/arenas
 */
export const getAllArenas = async (
  params: ArenaQueryParams = {}
): Promise<PaginatedResponse<Arena>> => {
  try {
    const response = await api.get('/arenas', { params });
    return response.data;
  } catch (error: any) {
    console.error('📄 Erro ao buscar arenas:', error.response?.data || error.message);
    throw new Error('Erro ao buscar arenas');
  }
};

/**
 * Buscar lista de cidades com arenas cadastradas
 * Endpoint: GET /api/v1/arenas/cidades
 */
export const getCidadesComArenas = async (query: string = ''): Promise<Cidade[]> => {
  try {
    const response = await api.get('/arenas/cidades', { params: { query } });
    return response.data;
  } catch (error: any) {
    console.error('📄 Erro ao buscar cidades:', error.response?.data || error.message);
    return [];
  }
};
