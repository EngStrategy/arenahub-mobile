import type { Quadra } from './Quadra';

export type StatusAssinatura = 'ATIVA' | 'INATIVA' | 'CANCELADA' | 'ATRASADA';


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