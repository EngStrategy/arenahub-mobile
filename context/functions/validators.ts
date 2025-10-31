export const validarBairro = (bairro: string): string => {
    const bairroTrimmed = bairro.trim();
    if (bairroTrimmed.length === 0) {
        return "O bairro é obrigatório.";
    }

    return '';
};

export const validarCEP = (cep: string): string => {
    const cepTrimmed = cep.replace(/[^\d]+/g, '');
    if (cepTrimmed.length === 0) {
        return "O CEP é obrigatório.";
    }
    if (cepTrimmed.length !== 8) {
        return "O CEP deve ter 8 dígitos.";
    }
    return '';
};

export const validarCNPJ = (cnpj: string): string => {
    const cnpjTrimmed = cnpj.replace(/[^\d]+/g, '');
    if (cnpjTrimmed.length !== 14) {
        return 'CNPJ inválido.';
    }
    // rejeita sequências repetidas (ex: '00000000000000', '11111111111111', ...)
    if (/^(\d)\1{13}$/.test(cnpjTrimmed)) {
        return 'CNPJ inválido.';
    }

    const toDigits = (s: string) => s.split('').map(d => parseInt(d, 10));
    const digits = toDigits(cnpjTrimmed);

    const calcVerifier = (nums: number[], weights: number[]) => {
        let sum = 0;
        for (let i = 0; i < weights.length; i++) {
            sum += nums[i] * weights[i];
        }
        const r = sum % 11;
        return r < 2 ? 0 : 11 - r;
    };

    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const v1 = calcVerifier(digits, weights1);
    if (v1 !== digits[12]) {
        return 'CNPJ inválido.';
    }

    const v2 = calcVerifier(digits, weights2);
    if (v2 !== digits[13]) {
        return 'CNPJ inválido.';
    }
    return '';
};


export const validarComplemento = (complemento: string) => {

    const complementoTrimmed = complemento.trim();
    if (complementoTrimmed.length === 0) {
        return "O complemento é obrigatório.";
    }
    if (complemento.length > 100) {
        return "O complemento deve ter no máximo 100 caracteres.";
    }
    return '';
};

export function validarCPF(cpf: string) {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return 'CPF inválido';

    let soma = 0,
        resto;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return 'CPF inválido';

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) return 'CPF inválido';

};

export const validarHorasCancelarAgendamento = (horas: string): string => {
    const horasTrimmed = horas.trim();
    if (horasTrimmed.length === 0) {
        return "A quantidade de horas é obrigatória.";
    }

    if (!/^\d+$/.test(horasTrimmed)) {
        return "A política de cancelamento deve conter apenas dígitos.";
    }

    const horasNumber = Number(horasTrimmed);

    if (horasNumber > 168) {
        return 'A política de cancelamento não pode ser maior que 168 horas (1 semana).';
    }
    return '';

};

export const validarNome = (nome: string): string => {
    const nomeTrimmed = nome.trim();
    if (nomeTrimmed.length === 0) {
        return "O nome é obrigatório.";
    }
    if (nomeTrimmed.length < 2) {
        return "O nome deve ter pelo menos 2 caracteres.";
    }
    if (nomeTrimmed.length > 100) {
        return "O nome deve ter no máximo 100 caracteres.";
    }
    return '';
};


export const validarNomeArena = (nomeArena: string): string => {
    const nomeTrimmed = nomeArena.trim();
    if (nomeTrimmed.length === 0) {
        return "O nome da arena é obrigatório.";
    }
    if (nomeTrimmed.length < 2) {
        return "O nome da arena deve ter pelo menos 2 caracteres.";
    }
    if (nomeTrimmed.length > 100) {
        return "O nome da arena deve ter no máximo 100 caracteres.";
    }
    return '';
};


export const validarNumero = (numero: string): string => {
    const numeroTrimmed = numero.trim();
    if (numeroTrimmed.length === 0) {
        return "O número é obrigatório.";
    }
    if (!/^\d+$/.test(numeroTrimmed)) {
        return "O número deve conter apenas dígitos.";
    }
    return '';
};


export function validarTelefone(telefone: string): string {
    const telefoneLimpo = telefone.replace(/[^\d]+/g, "");
    const regexTelefone = /^(?:\+55)?(?:\s?\(?[1-9][0-9]\)?\s?)?(?:9[0-9]{4}-?[0-9]{4}|[2-9][0-9]{3}-?[0-9]{4})$/;

    if (!regexTelefone.test(telefoneLimpo)) {
        return "Número de telefone inválido";
    }

    return '';
}


export const validarRua = (rua: string): string => {
    const ruaTrimmed = rua.trim();
    if (ruaTrimmed.length === 0) {
        return "A rua é obrigatória.";
    }

    return '';
};


export const validarConfirmPassword = (pwd: string, confirmPwd: string) => {
    if (!confirmPwd) {
        return 'Por favor, confirme sua nova senha';
    }
    if (pwd !== confirmPwd) {
        return 'As senhas não coincidem';
    }
    return '';
};

export const validarEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validarPassword = (pwd: string) => {
    if (!pwd) {
        return 'Por favor, insira sua nova senha';
    }
    if (pwd.length < 8) {
        return 'A senha deve ter no mínimo 8 caracteres';
    }
    return '';
};