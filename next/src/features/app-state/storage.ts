import Storage from 'expo-sqlite/kv-store';

export function readStoredString(key: string, fallback: string) {
  try {
    return Storage.getItemSync(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStoredString(key: string, value: string) {
  Storage.setItemSync(key, value);
}

export function readStoredJson<T>(key: string, fallback: T) {
  const rawValue = readStoredString(key, '');

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export function writeStoredJson<T>(key: string, value: T) {
  writeStoredString(key, JSON.stringify(value));
}
