export function guard<T>(value: T, path: string, defaultValue: unknown): unknown {
  if (path === '' && value != null) {
    return value;
  }

  if (path.startsWith('.') || path.endsWith('.')) {
    return defaultValue;
  }

  const parts = path.split('.');
  if (parts.length === 0) {
    return defaultValue;
  }

  return parts.reduce<unknown>(
    (current, key) => (current != null && (current as Record<string, unknown>)[key] != null ? (current as Record<string, unknown>)[key] : defaultValue),
    value,
  );
}

export function safeValue<T>(value: T | null | undefined, defaultValue: T): T {
  return value == null ? defaultValue : value;
}

export function copy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
