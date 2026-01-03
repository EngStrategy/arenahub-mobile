import { QuadraCreate, Quadra, HorariosDisponiveis } from '@/context/types/Quadra';
import api from '@/services/api';


export const createQuadra = async (newQuadra: QuadraCreate): Promise<Quadra> => {
    console.log("Cadastrando nova Quadra:", newQuadra);
    const response = await api.post<Quadra>('/quadras', newQuadra);
    return response.data;
};

export const getQuadrasByArena = async (arenaId: string): Promise<Quadra[]> => {
  const response = await api.get<Quadra[]>(`/quadras/arena/${arenaId}`);
  return response.data;
};

export const getQuadraById = async (id: number): Promise<Quadra> => {
    const response = await api.get<Quadra>(`/quadras/${id}`);
    return response.data;
};

export const updateQuadra = async (id: number, data: Partial<Quadra>): Promise<Quadra> => {
    try {
        const response = await api.put<Quadra>(`/quadras/${id}`, data);
        return response.data;
    } catch (error: any) {
        const message = 
            error.response?.data?.message || 
            error.message || 
            'Erro ao atualizar quadra';
        
        throw new Error(message);
    }
};

export const deleteQuadra = async (id: number): Promise<void> => {
    await api.delete(`/quadras/${id}`);
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