import { Platform } from 'react-native';

const memoryStore = new Map<string, string>();

function canUseWebStorage() {
  return Platform.OS === 'web' && typeof window !== 'undefined' && !!window.localStorage;
}

export function readPreference(key: string, fallback: string) {
  if (canUseWebStorage()) {
    return window.localStorage.getItem(key) ?? fallback;
  }

  return memoryStore.get(key) ?? fallback;
}

export function writePreference(key: string, value: string) {
  if (canUseWebStorage()) {
    window.localStorage.setItem(key, value);
    return;
  }

  memoryStore.set(key, value);
}
