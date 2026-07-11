import {SafeValue} from '../utils/SafeGuard';

class SafeFetch {
  static async get(api: string, ...extra: any) {
    const format = require('string-format');
    let lang = '';
    if (extra.length > 1) {
      lang = extra.pop();
    }
    const link = format(api, ...extra) + lang;
    console.log(`SafeFetch\n${link}`);
    try {
      const res = await fetch(link);
      if (res.status === 200) {
        const json = await res.json();
        if (json && json.status === 'ok') {
          return json;
        }
      }
    } catch {}
    return {};
  }

  static async normal(api: string) {
    console.log(`NormalFetch\n${api}`);
    try {
      const res = await fetch(api);
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

export {SafeFetch};
