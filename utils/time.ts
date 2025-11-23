export const timeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

export const minutesToTime = (minutes: number) => {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const addDuration = (time: string, durationMins: number) => {
  return minutesToTime(timeToMinutes(time) + durationMins);
};

export const subDuration = (time: string, durationMins: number) => {
  return minutesToTime(timeToMinutes(time) - durationMins);
};

export const getDuracaoEmMinutos = (duracaoEnum: string) => {
  switch (duracaoEnum) {
    case 'TRINTA_MINUTOS': return 30;
    case 'UMA_HORA': return 60;
    case 'UMA_HORA_E_MEIA': return 90;
    case 'DUAS_HORAS': return 120;
    default: return 60;
  }
};