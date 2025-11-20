// hooks/useTimer.ts
import { useState, useEffect } from 'react';

export const useTimer = (initialTime: number, startImmediately = false) => {
  const [timer, setTimer] = useState(initialTime);
  const [isActive, setIsActive] = useState(startImmediately);

  useEffect(() => {
    if (!isActive || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timer]);

  const startTimer = (time?: number) => {
    setTimer(time || initialTime);
    setIsActive(true);
  };

  const resetTimer = () => {
    setTimer(initialTime);
    setIsActive(false);
  };

  return { timer, isActive, startTimer, resetTimer };
};