import { useCallback, useSyncExternalStore } from 'react';

const subscribe = (callback: () => void) => {
  window.addEventListener('popstate', callback);
  return () => {
    window.removeEventListener('popstate', callback);
  };
};

export function useURLState<T>(key: string, defaultValue: T): [T, (newValue: T) => void] {
  const getSnapshot = () => {
    if (typeof window === 'undefined') return defaultValue;
    const url = new URL(window.location.href);
    const val = url.searchParams.get(key);
    return val !== null ? (val as T) : defaultValue;
  };

  const getServerSnapshot = () => defaultValue;

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (newValue: T) => {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (newValue === null || newValue === undefined || newValue === '') {
          url.searchParams.delete(key);
        } else {
          url.searchParams.set(key, String(newValue));
        }
        window.history.pushState({}, '', url.toString());
        window.dispatchEvent(new Event('popstate')); // force sync external store to update
      }
    },
    [key]
  );

  return [value, setValue];
}
