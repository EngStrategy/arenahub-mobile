import { DiaDaSemana } from "@/types/Horario";

export const formatarDiaSemanaCompleto = (dia: DiaDaSemana): string => {
    const mapa: Record<DiaDaSemana, string> = {
        DOMINGO: "Domingo", SEGUNDA: "Segunda-feira", TERCA: "Terça-feira",
        QUARTA: "Quarta-feira", QUINTA: "Quinta-feira", SEXTA: "Sexta-feira", SABADO: "Sábado"
    };
    return mapa[dia] || dia;
};