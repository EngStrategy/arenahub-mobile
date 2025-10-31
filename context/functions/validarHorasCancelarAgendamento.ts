export const validarHorasCancelarAgendamento = (horas: string): string => {
const horasTrimmed = horas.trim();
  if (horasTrimmed.length === 0) {
    return "A quantidade de horas é obrigatória.";
  }

const horasNumber = Number(horasTrimmed);

if (horasNumber > 168) {
  return 'A política de cancelamento não pode ser maior que 168 horas (1 semana).';
}
  return '';

};