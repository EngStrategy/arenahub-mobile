export type TipoStatusParticipacao = "PENDENTE" | "ACEITO" | "RECUSADO" | "CANCELADO";

export interface ParticipacaoJogoAberto {
    solicitacaoId: number;
    agendamentoId: number;
    nomeArena: string;
    nomeQuadra: string;
    urlFotoArena: string;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    esporte: string;
    status: TipoStatusParticipacao;
    nomeDono: string;
    telefoneDono: string;
    urlFotoDono: string;
}

export interface SolicitacaoJogoAberto {
    id: number;
    agendamentoId: number;
    solicitanteId: string;
    nomeSolicitante: string;
    telefoneSolicitante: string;
    fotoSolicitante: string;
    status: "PENDENTE" | "ACEITO" | "RECUSADO";
}

export interface JogoAberto {
    agendamentoId: number;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    vagasDisponiveis: number;
    esporte: string;
    nomeArena: string;
    nomeQuadra: string;
    cidade: string;
    urlFotoArena: string;
    urlFotoAtleta: string;
    nomeAtleta: string;
    telefoneAtleta: string;
    jaSolicitado: boolean;
}

export interface JogosAbertosQueryParams {
    page?: number;
    size?: number;
    sort?: string;
    direction?: "asc" | "desc";
    cidade?: string;
    esporte?: string;
    latitude?: number;
    longitude?: number;
    raioKm?: number;
}