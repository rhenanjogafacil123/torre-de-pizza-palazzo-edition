import { useState, useEffect } from "react";

export function usePersistedState<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setState(JSON.parse(item));
      }
    } catch {
      // localStorage indisponível ou JSON inválido
    } finally {
      setLoaded(true);
    }
  }, [key]);

  useEffect(() => {
    if (loaded) {
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch {
        // Excedeu quota ou storage desabilitado
      }
    }
  }, [key, state, loaded]);

  return [state, setState];
}
