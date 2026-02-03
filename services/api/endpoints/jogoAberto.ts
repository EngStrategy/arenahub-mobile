import { api } from '@/services/api';
import { PaginatedResponse } from '@/types/General';
import { JogoAberto, JogosAbertosQueryParams, ParticipacaoJogoAberto, SolicitacaoJogoAberto } from '@/types/Jogo';

export const getAllJogosAbertos = async (
    params: JogosAbertosQueryParams = {}
): Promise<PaginatedResponse<JogoAberto>> => {
    const response = await api.get<PaginatedResponse<JogoAberto>>('/jogos-abertos', { params });
    return response.data;
};

export const getMinhasParticipacoes = async (): Promise<ParticipacaoJogoAberto[]> => {
    const response = await api.get<ParticipacaoJogoAberto[]>('/jogos-abertos/minhas-participacoes');
    return response.data;
};

export const solicitarEntrada = async (agendamentoId: number): Promise<void> => {
    try {
        await api.post(`/jogos-abertos/${agendamentoId}/solicitar-entrada`, {});
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'Erro ao solicitar entrada';
        throw new Error(message);
    }
};

export const sairJogoAberto = async (solicitacaoId: number): Promise<void> => {
    await api.delete(`/jogos-abertos/solicitacoes/${solicitacaoId}/sair`);
};

/**
 * Busca as solicitações pendentes de um agendamento público que EU criei
 */
export const getSolicitacoesJogo = async (agendamentoId: number): Promise<SolicitacaoJogoAberto[]> => {
    const response = await api.get<SolicitacaoJogoAberto[]>(`/jogos-abertos/${agendamentoId}/solicitacoes`);
    return response.data;
};

export const aceitarSolicitacao = async (solicitacaoId: number): Promise<void> => {
    await api.patch(`/jogos-abertos/solicitacoes/${solicitacaoId}`, { aceitar: true });
};

export const recusarSolicitacao = async (solicitacaoId: number): Promise<void> => {
    await api.patch(`/jogos-abertos/solicitacoes/${solicitacaoId}`, { aceitar: false });
};