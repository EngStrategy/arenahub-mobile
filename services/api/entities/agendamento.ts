import api from '@/services/api';

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
