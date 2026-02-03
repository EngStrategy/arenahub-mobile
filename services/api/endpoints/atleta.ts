import { api } from '@/services/api';
import { Atleta } from '@/types/Atleta';

/**
 * Buscar dados do atleta por ID
 * Endpoint: GET /api/v1/atletas/{id}
 */
export const getAtletaById = async (id: string): Promise<Atleta> => {
    try {
        const response = await api.get<Atleta>(`/atletas/${id}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || 'Erro ao buscar dados do atleta';
        throw new Error(message);
    }
};

/**
 * Atualizar dados do atleta
 * Endpoint: PATCH /api/v1/atletas/{id}
 */
export const updateAtleta = async (id: string, data: Partial<Atleta>): Promise<Atleta> => {
    const response = await api.put<Atleta>(`/atletas/${id}`, data);
    return response.data;
};

/**
 * Alterar senha do usuário
 * Endpoint: PATCH /api/v1/usuarios/update-password (assumindo endpoint)
 */
export const updatePassword = async (senhaAtual: string, novaSenha: string, confirmacaoNovaSenha: string): Promise<void> => {
    try {
        await api.patch('/atletas/me/alterar-senha', {
            senhaAtual,
            novaSenha,
            confirmacaoNovaSenha
        });
    } catch (error: any) {
        const message = error.response?.data?.message || 'Erro ao alterar senha. Verifique sua senha atual.';
        throw new Error(message);
    }
};