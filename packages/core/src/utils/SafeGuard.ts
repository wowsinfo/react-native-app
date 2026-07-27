export function Guard<T, D>(obj: T, path: string, dval: D): T | D {
  if (path === "" && obj != null) {
    return obj;
  }
  if (!path.startsWith(".") && !path.endsWith(".")) {
    const p = path.split(".");
    if (p && p.length > 0) {
      let current: any = obj;
      for (const key of p) {
        if (current != null && key in current) {
          current = current[key];
        } else {
          return dval;
        }
      }
      return current;
    }
  }
  return dval;
}

export function SafeValue<T, D>(obj: T, dval: D) {
  if (obj == null) {
    return dval;
  }
  return obj;
}
