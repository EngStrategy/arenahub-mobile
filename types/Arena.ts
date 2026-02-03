import type { Quadra } from './Quadra';

export type StatusAssinatura = 'ATIVA' | 'INATIVA' | 'CANCELADA' | 'ATRASADA';

export interface ArenaQueryParams {
    page?: number;
    size?: number;
    sort?: string;
    direction?: 'asc' | 'desc';
    cidade?: string;
    esporte?: 'FUTEBOL_SOCIETY' | 'FUTEBOL_SETE' | 'FUTEBOL_ONZE' | 'FUTSAL' | 'BEACHTENNIS' | 'VOLEI' | 'FUTEVOLEI' | 'BASQUETE' | 'HANDEBOL';
    latitude?: number;
    longitude?: number;
    raioKm?: number;
}

export interface Arena {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    endereco: {
        cep: string;
        estado: string;
        cidade: string;
        bairro: string;
        rua: string;
        numero: string;
        complemento: string;
        latitude?: number | null;
        longitude?: number | null;
    };
    descricao: string;
    urlFoto: string;
    dataCriacao: string;
    role: string;
    esportes?: string[];
    quadras?: Quadra[];
    notaMedia?: number;
    horasCancelarAgendamento: number;
    quantidadeAvaliacoes?: number;
    statusAssinatura?: StatusAssinatura;
}

export interface Cidade {
    nome: string;
    estado: string;
}