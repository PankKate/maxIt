import { useState } from "react";

export const useLocalStorage = <T>(key: string, init: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return init;

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : init;
    } catch {
      return init;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  };

  return [storedValue, setValue] as const;
};
