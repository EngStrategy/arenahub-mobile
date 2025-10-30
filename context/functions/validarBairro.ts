export const validarBairro = (bairro: string): string => {
  const bairroTrimmed = bairro.trim();
  if (bairroTrimmed.length === 0) {
    return "O bairro é obrigatório.";
  }

  return '';
};