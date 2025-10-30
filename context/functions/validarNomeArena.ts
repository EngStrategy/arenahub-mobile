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
