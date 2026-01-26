import api from '@/services/api';

export type StatusAgendamentoArena = "PENDENTE" | "PAGO" | "CANCELADO" | "AUSENTE" | "FINALIZADO";

export interface AgendamentoArenaQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: "asc" | "desc";
  dataInicio?: string;
  dataFim?: string;
  status?: StatusAgendamentoArena;
  quadraId?: number;
}

export interface AgendamentoArena {
  id: number;
  dataAgendamento: string; 
  horarioInicio: string;   
  horarioFim: string;      
  valorTotal: number;
  status: StatusAgendamentoArena;
  nomeQuadra: string;
  nomeAtleta: string;
  urlFotoAtleta: string;
}

export interface AgendamentoCreate {
  quadraId: number;
  dataAgendamento: string;
  slotHorarioIds: number[];
  esporte: string;
  periodoFixo?: "UM_MES" | "TRES_MESES" | "SEIS_MESES";
  numeroJogadoresNecessarios: number;
  isFixo: boolean;
  isPublico: boolean;
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface AvaliacaoRequest {
  nota: number;
  comentario?: string;
}

export interface AvaliacaoResponse {
  id: number;
  nota: number;
  comentario: string;
  dataAvaliacao: string;
  nomeAtleta: string;
  urlFotoAtleta: string;
}

// ================= MÉTODOS =================

export const getAllAgendamentosArena = async (
  params: AgendamentoArenaQueryParams = {}
): Promise<PaginatedResponse<AgendamentoArena>> => {
  const response = await api.get<PaginatedResponse<AgendamentoArena>>('/arena/agendamentos', {
    params,
  });
  return response.data;
};

export const updateStatusAgendamentoArena = async (
  agendamentoId: number,
  status: StatusAgendamentoArena
): Promise<void> => {
  await api.patch(`/arena/agendamentos/${agendamentoId}/status`, { status });
};

export const atualizarAvaliacao = async (
    avaliacaoId: number,
    avaliacao: { nota?: number; comentario?: string }
): Promise<void> => {
    await api.put(`/agendamentos/avaliacoes/${avaliacaoId}`, avaliacao);
};

export async function avaliarAgendamento(
  agendamentoId: number,
  payload: AvaliacaoRequest
): Promise<AvaliacaoResponse> {
  const response = await api.post<AvaliacaoResponse>(
    `/agendamentos/${agendamentoId}/avaliacoes`,
    payload
  );

  return response.data;
}

export const createAgendamento = async (payload: AgendamentoCreate): Promise<any> => {
  const response = await api.post('/agendamentos', payload);
  return response.data;
};