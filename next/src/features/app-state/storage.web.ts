function getWebStorage() {
  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    return null;
  }

  return globalThis.localStorage;
}

export function readStoredString(key: string, fallback: string) {
  try {
    return getWebStorage()?.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStoredString(key: string, value: string) {
  try {
    getWebStorage()?.setItem(key, value);
  } catch {
    // Ignore browser storage failures so web rendering can continue.
  }
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
