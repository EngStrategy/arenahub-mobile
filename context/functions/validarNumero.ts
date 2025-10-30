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
