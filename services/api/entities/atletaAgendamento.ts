import { api } from '@/services/api';

// === TIPOS E ENUMS ===
export type StatusAgendamento = "PENDENTE" | "AUSENTE" | "CANCELADO" | "PAGO" | "ACEITO" | "RECUSADO" | "FINALIZADO" | "AGUARDANDO_PAGAMENTO";
export type TipoAgendamentoFilter = "NORMAL" | "FIXO" | "AMBOS";
export type TipoStatusParticipacao = "PENDENTE" | "ACEITO" | "RECUSADO" | "CANCELADO";
export type PeriodoAgendamentoFixo = "UM_MES" | "TRES_MESES" | "SEIS_MESES";
export type StatusDisponibilidade = "DISPONIVEL" | "INDISPONIVEL" | "MANUTENCAO";

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
    agendamentoFixoId?: number;
    numeroJogadoresNecessarios?: number;
}

export interface AgendamentoCreate {
    quadraId: number;
    dataAgendamento: string;
    slotHorarioIds: Array<number>;
    esporte: string;
    periodoFixo?: PeriodoAgendamentoFixo;
    numeroJogadoresNecessarios: number;
    isFixo?: boolean;
    isPublico?: boolean;
    cpfCnpjPagamento?: string;
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
    nomeDono: string;
    telefoneDono: string;
    urlFotoDono: string;
}

export interface SolicitacaoJogoAberto {
    id: number;
    agendamentoId: number;
    solicitanteId: string;
    nomeSolicitante: string;
    telefoneSolicitante: string;
    fotoSolicitante: string;
    status: "PENDENTE" | "ACEITO" | "RECUSADO";
}

export interface JogoAberto {
    agendamentoId: number;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    vagasDisponiveis: number;
    esporte: string;
    nomeArena: string;
    nomeQuadra: string;
    cidade: string;
    urlFotoArena: string;
    urlFotoAtleta: string;
    nomeAtleta: string;
    telefoneAtleta: string;
    jaSolicitado: boolean;
}

// === INTERFACES DE PARAMS ===
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

export interface JogosAbertosQueryParams {
    page?: number;
    size?: number;
    sort?: string;
    direction?: "asc" | "desc";
    cidade?: string;
    esporte?: string;
    latitude?: number;
    longitude?: number;
    raioKm?: number;
}

interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    last: boolean;
}

// === ENDPOINTS AGENDAMENTOS ===

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

// === ENDPOINTS AVALIAÇÕES ===

export const criarOuDispensarAvaliacao = async (
    agendamentoId: number,
    avaliacao?: { nota?: number; comentario?: string }
): Promise<void> => {
    await api.post(`/agendamentos/${agendamentoId}/avaliacoes`, avaliacao);
};

export const dispensarAvaliacao = async (agendamentoId: number): Promise<void> => {
    await api.post(`/agendamentos/${agendamentoId}/avaliacoes`, {});
};

// === ENDPOINTS JOGOS ABERTOS ===

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