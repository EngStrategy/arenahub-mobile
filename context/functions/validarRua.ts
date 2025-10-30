export const validarRua = (rua: string): string => {
  const ruaTrimmed = rua.trim();
  if (ruaTrimmed.length === 0) {
    return "A rua é obrigatória.";
  }

  return '';
};