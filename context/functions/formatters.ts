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
    const data = new Date(dataString + 'T00:00:00');

    const dia = data.toLocaleDateString('pt-BR', { day: '2-digit' });
    const mes = data.toLocaleDateString('pt-BR', { month: 'long' });
    const ano = data.toLocaleDateString('pt-BR', { year: 'numeric' });

    return `${dia} ${mes} ${ano}`;
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
