import { AvaliacaoPorQuadra } from "./Avaliacao";

export type StatusAgendamento = "PENDENTE" | "AUSENTE" | "CANCELADO" | "PAGO" | "ACEITO" | "RECUSADO" | "FINALIZADO" | "AGUARDANDO_PAGAMENTO";
export type TipoAgendamentoFilter = "NORMAL" | "FIXO" | "AMBOS";
export type PeriodoAgendamentoFixo = "UM_MES" | "TRES_MESES" | "SEIS_MESES";
export type StatusDisponibilidade = "DISPONIVEL" | "INDISPONIVEL" | "MANUTENCAO";

export interface AgendamentoAtleta {
    id: number;
    dataAgendamento: string;
    horarioInicio: string;
    horarioFim: string;
    valorTotal: number;
    esporte: string;
    status: StatusAgendamento;
    quadraId: number;
    nomeQuadra: string;
    nomeArena: string;
    urlFotoQuadra: string;
    urlFotoArena: string;
    fixo: boolean;
    publico: boolean;
    possuiSolicitacoes: boolean;
    avaliacao: AvaliacaoPorQuadra | null;
    avaliacaoDispensada: boolean;
    agendamentoFixoId?: number;
    numeroJogadoresNecessarios?: number;
}

export interface AgendamentoCreate {
    quadraId: number;
    dataAgendamento: string;
    slotHorarioIds: number[];
    esporte: string;
    periodoFixo?: PeriodoAgendamentoFixo;
    numeroJogadoresNecessarios: number;
    isFixo?: boolean;
    isPublico?: boolean;
    cpfCnpjPagamento?: string;
}

export interface AgendamentoAtletaQueryParams {
    page?: number;
    size?: number;
    sort?: string;
    direction?: "asc" | "desc";
    dataInicio?: string;
    dataFim?: string;
    tipoAgendamento?: TipoAgendamentoFilter;
    status?: StatusAgendamento;
}