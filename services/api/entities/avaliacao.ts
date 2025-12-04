import api from '@/services/api';
import { Avaliacao } from '@/context/types/Avaliacao';
import { PaginatedResponse } from './arena';

export const getAvaliacoesPorQuadra = async (
    quadraId: number, 
    page = 0, 
    size = 5 // Trazemos menos por quadra para não pesar tanto
): Promise<PaginatedResponse<Avaliacao>> => {
    try {
        const response = await api.get<PaginatedResponse<Avaliacao>>(
            `/quadras/${quadraId}/avaliacoes`, 
            { params: { page, size, sort: 'dataAvaliacao', direction: 'desc' } }
        );
        return response.data;
    } catch (error: any) {
        console.error(`Erro ao buscar avaliações da quadra ${quadraId}:`, error);
        return { content: [], last: true } as any; // Retorna vazio em caso de erro para não quebrar o Promise.all
    }
};