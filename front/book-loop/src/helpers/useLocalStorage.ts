import { useState, useEffect } from 'react';

function getStorageValue<T>(key: string, defaultValue: T): T {
  // Получение сохраненного значения из localStorage
  const saved = localStorage.getItem(key);
  if (saved !== null) {
    try {
      return JSON.parse(saved) as T;
    } catch {
      console.error(`Error parsing JSON from localStorage for key "${key}".`);
    }
  }
  return defaultValue;
}

export const useLocalStorage = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => getStorageValue<T>(key, defaultValue));

  useEffect(() => {
    // Сохранение значения в localStorage при его изменении
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

