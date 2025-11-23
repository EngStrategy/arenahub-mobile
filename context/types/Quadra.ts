import type { HorarioFuncionamento, HorarioFuncionamentoCreate} from "./Horario";

export type TipoQuadra = "FUTEBOL_SOCIETY" | "FUTEBOL_SETE" | "FUTEBOL_ONZE" | "FUTSAL" | "BEACHTENNIS" | "VOLEI" | "FUTEVOLEI" | "BASQUETE" | "HANDEBOL";

export type MaterialFornecido = "BOLA" | "COLETE" | "LUVA" | "CONE" | "APITO" | "BOMBA" | "MARCADOR_PLACAR" | "BOTAO_GOL";

export type DuracaoReserva = "TRINTA_MINUTOS" | "UMA_HORA" | "UMA_HORA_E_MEIA" | "DUAS_HORAS";

export type StatusHorario = "DISPONIVEL" | "INDISPONIVEL" | "MANUTENCAO";

export interface Quadra {
    id: number;
    nomeQuadra: string;
    urlFotoQuadra: string;
    tipoQuadra: Array<TipoQuadra>;
    descricao: string;
    duracaoReserva: DuracaoReserva;
    cobertura: boolean;
    iluminacaoNoturna: boolean;
    materiaisFornecidos: Array<MaterialFornecido>;
    arenaId: string;
    nomeArena: string;
    horariosFuncionamento: Array<HorarioFuncionamento>;
    notaMedia: number;
    quantidadeAvaliacoes: number;
}

export interface QuadraCreate {
    nomeQuadra: string;
    urlFotoQuadra: string;
    tipoQuadra: Array<TipoQuadra>;
    descricao: string;
    duracaoReserva: DuracaoReserva;
    cobertura: boolean;
    iluminacaoNoturna: boolean;
    materiaisFornecidos: Array<MaterialFornecido>;
    arenaId: string;
    horariosFuncionamento: Array<HorarioFuncionamentoCreate>;
}

export interface HorariosDisponiveis {
  id: number;
  horarioInicio: string;
  horarioFim: string;
  valor: number;
  statusDisponibilidade: StatusHorario;
}
