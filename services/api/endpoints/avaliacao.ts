import { api } from '@/services/api';
import { AvaliacaoPorQuadra } from '@/types/Avaliacao';
import { PaginatedResponse } from '@/types/General';

export const getAvaliacoesPorQuadra = async (
    quadraId: number,
    page = 0,
    size = 10
): Promise<PaginatedResponse<AvaliacaoPorQuadra>> => {
    try {
        const response = await api.get<PaginatedResponse<AvaliacaoPorQuadra>>(
            `/quadras/${quadraId}/avaliacoes`,
            { params: { page, size, sort: 'dataAvaliacao', direction: 'desc' } }
        );
        return response.data;
    } catch (error: any) {
        console.error(`Erro ao buscar avaliações da quadra ${quadraId}:`, error);
        return { content: [], last: true } as any;
    }
};

export const criarOuDispensarAvaliacao = async (
    agendamentoId: number,
    avaliacao?: { nota?: number; comentario?: string }
): Promise<void> => {
    await api.post(`/agendamentos/${agendamentoId}/avaliacoes`, avaliacao);
};

export const avaliarAgendamento = async (
    agendamentoId: number,
    avaliacao: { nota: number; comentario?: string }
): Promise<void> => {
    await api.post(`/agendamentos/${agendamentoId}/avaliacoes`, avaliacao);
};

// export const dispensarAvaliacao = async (agendamentoId: number): Promise<void> => {
//     await api.post(`/agendamentos/${agendamentoId}/avaliacoes`, {});
// };