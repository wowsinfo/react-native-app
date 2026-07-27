export function Guard<D>(obj: unknown, path: string, dval: D): D {
  if (path === "" && obj != null) {
    return obj as unknown as D;
  }
  if (!path.startsWith(".") && !path.endsWith(".")) {
    const p = path.split(".");
    if (p && p.length > 0) {
      let current: unknown = obj;
      for (const key of p) {
        if (current != null && typeof current === "object" && key in current) {
          current = (current as Record<string, unknown>)[key];
        } else {
          return dval;
        }
      }
      return current as unknown as D;
    }
  }
  return dval;
}

export function SafeValue<T>(obj: unknown, dval: T): T {
  if (obj == null) {
    return dval;
  }
  return obj as T;
}
