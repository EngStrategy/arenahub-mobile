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