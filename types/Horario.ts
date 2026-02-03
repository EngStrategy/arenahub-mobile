export type StatusHorario = "DISPONIVEL" | "INDISPONIVEL" | "MANUTENCAO";

export type DiaDaSemana = "DOMINGO" | "SEGUNDA" | "TERCA" | "QUARTA" | "QUINTA" | "SEXTA" | "SABADO";

export type IntervaloHorario = {
    inicio: string | null;
    fim: string | null;
    valor: string | number | null;
    status: 'DISPONIVEL' | 'INDISPONIVEL' | 'MANUTENCAO' | null;
    id: number;
};

export type HorarioFuncionamento = {
    id: number;
    diaDaSemana: DiaDaSemana;
    intervalosDeHorario: {
        id: number;
        inicio: string;
        fim: string;
        valor: number;
        status: StatusHorario;
        slotsDisponiveis: string[] | null;
    }[];
};

export type HorarioFuncionamentoCreate = {
    diaDaSemana: DiaDaSemana;
    intervalosDeHorario: {
        id?: number;
        inicio: string;
        fim: string;
        valor: number;
        status: StatusHorario;
    }[];
};


export type HorariosDisponiveis = {
    id: number;
    horarioInicio: string;
    horarioFim: string;
    valor: number;
    statusDisponibilidade: StatusHorario;
};

export const horariosDaSemanaCompleta: HorarioFuncionamentoCreate[] = [
    { diaDaSemana: 'DOMINGO', intervalosDeHorario: [] },
    { diaDaSemana: 'SEGUNDA', intervalosDeHorario: [] },
    { diaDaSemana: 'TERCA', intervalosDeHorario: [] },
    { diaDaSemana: 'QUARTA', intervalosDeHorario: [] },
    { diaDaSemana: 'QUINTA', intervalosDeHorario: [] },
    { diaDaSemana: 'SEXTA', intervalosDeHorario: [] },
    { diaDaSemana: 'SABADO', intervalosDeHorario: [] },
];