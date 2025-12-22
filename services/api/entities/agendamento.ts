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
