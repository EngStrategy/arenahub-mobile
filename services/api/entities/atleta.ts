// services/api/entities/atleta.ts
import api from '@/services/api';

// ==================== INTERFACES ====================

// Interface baseada no uso do seu código web e app
export interface Atleta {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    urlFoto?: string;
    // Adicione outros campos se necessário
}

// ==================== FUNÇÕES DA API ====================

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
    try {
        const response = await api.put<Atleta>(`/atletas/${id}`, data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || 'Erro ao atualizar dados do atletaaa';
        throw new Error(message);
    }
};

/**
 * Alterar senha do usuário
 * Endpoint: PATCH /api/v1/usuarios/update-password (assumindo endpoint)
 * Se o endpoint for outro, ajuste a URL '/usuarios/update-password'
 */
export const updatePassword = async (senhaAtual: string, novaSenha: string, confirmacaoNovaSenha: string): Promise<void> => {
    try {
        // A API web recebia 3 argumentos, então vamos enviar os 3
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