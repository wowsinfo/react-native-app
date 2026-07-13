import { SafeValue } from "../utils/SafeGuard";

class SafeFetch {
  private static appKey: string = "";

  static setAppKey(key: string) {
    SafeFetch.appKey = key;
  }

  static async get(api: string, ...extra: any) {
    const format = require("string-format");
    let lang = "";
    if (extra.length > 1) {
      lang = extra.pop();
    }
    // Inject key before format() since string-format eats {appkey}
    const withKey = SafeFetch.appKey
      ? api.replace("{appkey}", SafeFetch.appKey)
      : api;
    const link = format(withKey, ...extra) + lang;
    try {
      const res = await fetch(link);
      if (res.status === 200) {
        const json = await res.json();
        if (json && json.status === "ok") {
          return json;
        }
      }
    } catch {}
    return {};
  }

  static async normal(api: string) {
    const link = SafeFetch.appKey
      ? api.replace("{appkey}", SafeFetch.appKey)
      : api;
    try {
      const res = await fetch(link);
      if (res.status === 200) {
        const json = await res.json();
        return SafeValue(json, {});
      }
    } catch (err) {
      console.error(err);
    }
    return {};
  }
}

export { SafeFetch };
