import api from '@/services/api';

export type StatusAgendamento = "PENDENTE" | "PAGO" | "CANCELADO" | "FINALIZADO" | "AGUARDANDO_PAGAMENTO";
export type TipoAgendamentoFilter = "NORMAL" | "FIXO" | "AMBOS";
export type TipoStatusParticipacao = "PENDENTE" | "ACEITO" | "RECUSADO";

export interface Avaliacao {
    idAvaliacao: number;
    nota: number;
    comentario?: string;
}

export interface AgendamentoAtleta {
    id: number;
    dataAgendamento: string;
    horarioInicio: string;
    horarioFim: string;
    valorTotal: number;
    esporte: string;
    status: StatusAgendamento;
    quadraId: number;
    nomeQuadra: string;
    nomeArena: string;
    urlFotoQuadra: string;
    urlFotoArena: string;
    fixo: boolean;
    publico: boolean;
    possuiSolicitacoes: boolean;
    avaliacao: Avaliacao | null;
    avaliacaoDispensada: boolean;
}

export interface ParticipacaoJogoAberto {
    solicitacaoId: number;
    agendamentoId: number;
    nomeArena: string;
    nomeQuadra: string;
    urlFotoArena: string;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    esporte: string;
    status: TipoStatusParticipacao;
}

export interface AgendamentoAtletaQueryParams {
    page?: number;
    size?: number;
    sort?: string;
    direction?: "asc" | "desc";
    dataInicio?: string;
    dataFim?: string;
    tipoAgendamento?: TipoAgendamentoFilter;
    status?: StatusAgendamento;
}

interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
}

// === ENDPOINTS ===

export const getAllAgendamentosAtleta = async (
    params: AgendamentoAtletaQueryParams = {}
): Promise<PaginatedResponse<AgendamentoAtleta>> => {
    const response = await api.get<PaginatedResponse<AgendamentoAtleta>>('/agendamentos/meus-agendamentos', {
        params,
    });
    return response.data;
};

export const getMinhasParticipacoes = async (): Promise<ParticipacaoJogoAberto[]> => {
    const response = await api.get<ParticipacaoJogoAberto[]>('/jogos-abertos/minhas-participacoes');
    return response.data;
};

export const sairJogoAberto = async (solicitacaoId: number): Promise<void> => {
    await api.delete(`/jogos-abertos/solicitacoes/${solicitacaoId}/sair`);
};

export const dispensarAvaliacao = async (agendamentoId: number): Promise<void> => {
    await api.post(`/agendamentos/${agendamentoId}/avaliacoes`, {});
};

export const cancelarAgendamento = async (agendamentoId: number): Promise<void> => {
    await api.delete(`/agendamentos/${agendamentoId}`);
};