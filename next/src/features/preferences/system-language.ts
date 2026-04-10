import type { Locale } from 'expo-localization';

import type { MessageLanguage } from '@/features/preferences/messages';

const traditionalChineseRegions = new Set(['HK', 'MO', 'TW']);

export function resolveSystemLanguage(locales: Locale[]): MessageLanguage {
  for (const locale of locales) {
    const languageCode = locale.languageCode?.toLowerCase();

    if (languageCode === 'ja') {
      return 'ja';
    }

    if (languageCode !== 'zh') {
      continue;
    }

    const scriptCode = locale.languageScriptCode?.toLowerCase();
    const regionCode = locale.languageRegionCode ?? locale.regionCode;

    if (
      scriptCode === 'hant' ||
      (regionCode != null && traditionalChineseRegions.has(regionCode.toUpperCase()))
    ) {
      return 'zh-hant';
    }

    return 'zh';
  }

  return 'en';
}
