import { useEffect, useState } from "react";
//  для дебаунса значения поиска 
// чтобы не дергать фильтрацию на каждый ввод символа
export function useDebouncedValue<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}