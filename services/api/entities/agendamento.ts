import api from '@/services/api';

export interface CriarAvaliacaoDTO {
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
  payload: CriarAvaliacaoDTO
): Promise<AvaliacaoResponse> {
  const response = await api.post<AvaliacaoResponse>(
    `/api/v1/agendamentos/${agendamentoId}/avaliacoes`,
    payload
  );

  return response.data;
}
