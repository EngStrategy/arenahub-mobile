import { api } from '@/services/api';
import { AgendamentoAtleta, AgendamentoAtletaQueryParams, AgendamentoCreate, StatusAgendamento } from '@/types/Agendamento';
import { PaginatedResponse } from '@/types/General';

export const createAgendamento = async (data: AgendamentoCreate): Promise<AgendamentoAtleta> => {
    const response = await api.post<AgendamentoAtleta>('/agendamentos', data);
    return response.data;
};

export const getAllAgendamentosAtleta = async (
    params: AgendamentoAtletaQueryParams = {}
): Promise<PaginatedResponse<AgendamentoAtleta>> => {
    const response = await api.get<PaginatedResponse<AgendamentoAtleta>>('/agendamentos/meus-agendamentos', { params });
    return response.data;
};

export const cancelarAgendamento = async (agendamentoId: number): Promise<void> => {
    await api.delete(`/agendamentos/${agendamentoId}`);
};

export const cancelarAgendamentoFixo = async (agendamentoFixoId: number): Promise<void> => {
    await api.delete(`/agendamentos/fixo/${agendamentoFixoId}`);
};

export const listarAgendamentosFixosFilhos = async (agendamentoFixoId: number): Promise<AgendamentoAtleta[]> => {
    const response = await api.get<AgendamentoAtleta[]>(`/agendamentos/fixo/${agendamentoFixoId}/filhos`);
    return response.data;
};

export const getAgendamentosAvaliacoesPendentes = async (): Promise<AgendamentoAtleta[]> => {
    const response = await api.get<AgendamentoAtleta[]>('/agendamentos/avaliacoes-pendentes');
    return response.data;
};

export const getAgendamentoStatus = async (agendamentoId: number): Promise<{ status: StatusAgendamento }> => {
    const response = await api.get<{ status: StatusAgendamento }>(`/agendamentos/${agendamentoId}/status`);
    return response.data;
};