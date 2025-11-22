import { QuadraCreate, Quadra, HorariosDisponiveis } from '@/context/types/Quadra';
import api from '@/services/api';


export const createQuadra = async (newQuadra: QuadraCreate): Promise<Quadra> => {
    console.log("Cadastrando nova Quadra:", newQuadra);
    const response = await api.post<Quadra>('/quadras', newQuadra);
    return response.data;
};

// Busca todas as quadras de uma arena específica
export const getQuadrasByArena = async (arenaId: string): Promise<Quadra[]> => {
  // O endpoint retorna um array direto conforme seu exemplo JSON
  const response = await api.get<Quadra[]>(`/quadras/arena/${arenaId}`);
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