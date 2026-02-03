import { Quadra, HorariosDisponiveis } from '@/types/Quadra';
import { api } from '@/services/api';

export const getQuadrasByArena = async (arenaId: string): Promise<Quadra[]> => {
  const response = await api.get<Quadra[]>(`/quadras/arena/${arenaId}`);
  return response.data;
};

export const getQuadraById = async (id: number): Promise<Quadra> => {
  const response = await api.get<Quadra>(`/quadras/${id}`);
  return response.data;
};

// Busca horários disponíveis para uma quadra em uma data
export const getHorariosDisponiveisPorQuadra = async (
  quadraId: number,
  data: string // formato YYYY-MM-DD
): Promise<HorariosDisponiveis[]> => {
  const response = await api.get<HorariosDisponiveis[]>(
    `/quadras/${quadraId}/horarios-disponiveis`,
    { params: { data } }
  );
  return response.data;
};