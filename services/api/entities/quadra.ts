import { type QuadraCreate, type Quadra } from '@/context/types/Quadra';
import api from '@/services/api';

export const createQuadra = async (newQuadra: QuadraCreate): Promise<Quadra> => {
    console.log("Cadastrando nova Quadra:", newQuadra);
    const response = await api.post<Quadra>('/quadras', newQuadra);
    return response.data;
};

export const getQuadrasByArenaId = async (arenaId: string): Promise<Quadra[]> => {
    const response = await api.get<Quadra[]>(`/quadras/arena/${arenaId}`);
    return response.data;
};

export const getQuadraById = async (id: number): Promise<Quadra> => {
    const response = await api.get<Quadra>(`/quadras/${id}`);
    return response.data;
};

export const updateQuadra = async (id: number, data: Partial<QuadraCreate>): Promise<Quadra> => {
    const response = await api.put<Quadra>(`/quadras/${id}`, data);
    return response.data;
};

export const deleteQuadra = async (id: number): Promise<void> => {
    await api.delete(`/quadras/${id}`);
};