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
