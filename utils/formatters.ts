import { MATERIAIS_OPTIONS, TipoQuadra } from "../types/Quadra";

// FORMATA O CEP 
export function formatarCEP(value: string): string {
    const digits = value.replace(/\D/g, '');

    if (digits.length === 0) return '';

    if (digits.length <= 5) {
        return digits;
    }

    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
}

// FORMATA O CNPJ
export function formatarCNPJ(value: string): string {
    const digits = value.replace(/\D/g, '');

    if (digits.length === 0) return '';

    if (digits.length <= 2) {
        return digits;
    }
    if (digits.length <= 5) {
        return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    }
    if (digits.length <= 8) {
        return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    }
    if (digits.length <= 12) {
        return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    }
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

// FORMATA O CPF
export function formatarCPF(value: string): string {
    const digits = value.replace(/\D/g, '');

    if (digits.length === 0) return '';

    if (digits.length <= 3) {
        return digits;
    }
    if (digits.length <= 6) {
        return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }
    if (digits.length <= 9) {
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    }
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

/**
 * Formata uma data no formato 'AAAA-MM-DD' para 'DD Mês AAAA' em português.
 * @param dataString A data em formato 'AAAA-MM-DD'.
 * @returns A data formatada, por exemplo, "07 maio 2025".
 */
export function formatarData(dataString: string): string {
    if (!dataString) return '';

    // Verifica se já possui o separador de tempo 'T'
    // Se NÃO tiver, adicionamos T00:00:00 para evitar problemas de fuso horário em datas puras
    // Se JÁ tiver, usamos como está.
    const dateToParse = dataString.includes('T') 
        ? dataString 
        : dataString + 'T00:00:00';

    const data = new Date(dateToParse);

    // Validação de segurança
    if (isNaN(data.getTime())) return 'Data inválida';

    // Usando métodos nativos get... para garantir compatibilidade total no Android/iOS
    const dia = data.getDate().toString().padStart(2, '0');
    const meses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    const mes = meses[data.getMonth()];
    const ano = data.getFullYear();

    return `${dia} de ${mes} de ${ano}`;
}

//FORMATA O TELEFONE
export function formatarTelefone(value: string): string {
    const digits = value.replace(/\D/g, '');

    if (digits.length === 0) return '';

    if (digits.length <= 2) {
        return `(${digits}`;
    }

    if (digits.length <= 6) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    if (digits.length <= 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

// FORMATA MOEDA BRASILEIRA
export const formatCurrency = (rawValue: string) => {
    let digits = String(rawValue || '').replaceAll(/\D/g, '');

    if (digits.length === 0) return 'R$ 0,00';

    const paddedValue = digits.padStart(3, '0');

    let integerPart = paddedValue.slice(0, -2);
    const decimalPart = paddedValue.slice(-2);

    integerPart = integerPart.replace(/^0+(?=\d)/, '');

    if (integerPart.length === 0) {
        integerPart = '0';
    }

    const formattedInteger = integerPart.replaceAll(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `R$ ${formattedInteger},${decimalPart}`;
};

export const formatarEsporte = (esporte: TipoQuadra) => {
    const mapa: Record<TipoQuadra, string> = {
        FUTEBOL_SOCIETY: 'Futebol Society', FUTEBOL_SETE: 'Futebol 7', FUTEBOL_ONZE: 'Futebol 11',
        FUTSAL: 'Futsal', BEACHTENNIS: 'Beach Tennis', VOLEI: 'Vôlei',
        FUTEVOLEI: 'Futevôlei', BASQUETE: 'Basquete', HANDEBOL: 'Handebol'
    };
    return mapa[esporte] || esporte;
};

export const formatarMaterial = (material: string): string => {
    const option = MATERIAIS_OPTIONS.find(opt => opt.value === material);
    return option ? option.label : material;
};

// FORMATA A MASCARA DE HORA HH:MM
export const formatTimeMask = (text: string) => {
    let cleaned = text.replaceAll(/\D/g, '');

    if (cleaned.length > 4) {
        cleaned = cleaned.substring(0, 4);
    }

    let hour = cleaned.substring(0, 2);
    let minute = cleaned.substring(2);


    if (hour.length === 2) {
        const hourValue = Number.parseInt(hour, 10);
        if (hourValue > 23) {
            hour = '23';
        }
    }

    if (minute.length === 2) {
        const minuteValue = Number.parseInt(minute, 10);
        if (minuteValue > 59) {
            minute = '59';
        }
    }

    if (cleaned.length > 2) {
        return `${hour}:${minute}`;
    }

    return hour;
};