export function Guard(obj: any, path: string, dval: any): any {
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

export function SafeValue(obj: any, dval: any): any {
  if (obj == null) {
    return dval;
  }
  return obj;
}
