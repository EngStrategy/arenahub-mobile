import { type QuadraCreate, type Quadra } from '@/context/types/Quadra';
import api from '@/services/api';

export const createQuadra = async (newQuadra: QuadraCreate): Promise<Quadra> => {
    console.log("Cadastrando nova Quadra:", newQuadra);
    const response = await api.post<Quadra>('/quadras', newQuadra);
    return response.data;
};