import { useEffect, useState } from 'react';

/**
 * Hook para aplicar debounce em um valor
 * @param value - O valor a ser debounced
 * @param delay - O tempo de atraso em milissegundos
 * @returns O valor debounced
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Define um timer para atualizar o valor após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor mudar antes do delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}