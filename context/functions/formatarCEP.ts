export function formatarCEP(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 0) return '';

  if (digits.length <= 5) {
    return digits;
  }

  // Acima de 5 → adiciona o hífen
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
}
