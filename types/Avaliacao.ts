export interface AvaliacaoPorQuadra {
    id: number;
    nota: number;
    comentario: string;
    dataAvaliacao: string;
    nomeAtleta: string;
    urlFotoAtleta: string;
}

export interface AvaliacaoExecutar {
    idAvaliacao: number;
    nota: number;
    comentario?: string;
}