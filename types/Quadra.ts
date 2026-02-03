import type { HorarioFuncionamento, HorarioFuncionamentoCreate } from "./Horario";

export type TipoQuadra = "FUTEBOL_SOCIETY" | "FUTEBOL_SETE" | "FUTEBOL_ONZE" | "FUTSAL" | "BEACHTENNIS" | "VOLEI" | "FUTEVOLEI" | "BASQUETE" | "HANDEBOL";

export type MaterialFornecido = "BOLA" | "COLETE" | "LUVA" | "CONE" | "APITO" | "BOMBA" | "MARCADOR_PLACAR" | "BOTAO_GOL";

export type DuracaoReserva = "TRINTA_MINUTOS" | "UMA_HORA" | "UMA_HORA_E_MEIA" | "DUAS_HORAS";

export type StatusHorario = "DISPONIVEL" | "INDISPONIVEL" | "MANUTENCAO";

export const TIPO_QUADRA_OPTIONS = [
    { value: 'FUTEBOL_SOCIETY', label: 'Futebol society' },
    { value: 'FUTEBOL_SETE', label: 'Futebol 7' },
    { value: 'FUTEBOL_ONZE', label: 'Futebol 11' },
    { value: 'FUTEBOL_AREIA', label: 'Futebol de areia' },
    { value: 'FUTSAL', label: 'Futsal' },
    { value: 'BEACHTENNIS', label: 'Beach tennis' },
    { value: 'VOLEI', label: 'Vôlei' },
    { value: 'FUTEVOLEI', label: 'Futevôlei' },
    { value: 'BASQUETE', label: 'Basquete' },
    { value: 'HANDEBOL', label: 'Handebol' },
];

export const MATERIAIS_OPTIONS = [
    { value: 'BOLA', label: 'Bola' },
    { value: 'COLETE', label: 'Colete' },
    { value: 'APITO', label: 'Apito' },
    { value: 'LUVA', label: 'Luva' },
    { value: 'CONE', label: 'Cone' },
    { value: 'BOMBA', label: 'Bomba' },
    { value: 'MARCADOR_PLACAR', label: 'Marcador de placar' },
    { value: 'BOTAO_GOL', label: 'Botão de gol' },
];

export const DURACAO_OPTIONS = [
    { value: 'TRINTA_MINUTOS', label: '30 minutos' },
    { value: 'UMA_HORA', label: '1 hora' },
    { value: 'UMA_HORA_E_MEIA', label: '1 hora e meia' },
    { value: 'DUAS_HORAS', label: '2 horas' },
];

export const STATUS_OPTIONS = [
    { label: 'Disponível', value: 'DISPONIVEL', hexColor: '#047857' },
    { label: 'Indisponível', value: 'INDISPONIVEL', hexColor: '#DC2626' },
    { label: 'Manutenção', value: 'MANUTENCAO', hexColor: '#2563EB' },
];

export interface Quadra {
    id: number;
    nomeQuadra: string;
    urlFotoQuadra: string;
    tipoQuadra: TipoQuadra[];
    descricao: string;
    duracaoReserva: DuracaoReserva;
    cobertura: boolean;
    iluminacaoNoturna: boolean;
    materiaisFornecidos: MaterialFornecido[];
    arenaId: string;
    nomeArena: string;
    horariosFuncionamento: HorarioFuncionamento[];
    notaMedia: number;
    quantidadeAvaliacoes: number;
}

export interface QuadraCreate {
    nomeQuadra: string;
    urlFotoQuadra: string;
    tipoQuadra: TipoQuadra[];
    descricao: string;
    duracaoReserva: DuracaoReserva;
    cobertura: boolean;
    iluminacaoNoturna: boolean;
    materiaisFornecidos: MaterialFornecido[];
    arenaId: string;
    horariosFuncionamento: HorarioFuncionamentoCreate[];
}

export interface HorariosDisponiveis {
    id: number;
    horarioInicio: string;
    horarioFim: string;
    valor: number;
    statusDisponibilidade: StatusHorario;
}
