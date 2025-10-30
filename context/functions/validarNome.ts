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
