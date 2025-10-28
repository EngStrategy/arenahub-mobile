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