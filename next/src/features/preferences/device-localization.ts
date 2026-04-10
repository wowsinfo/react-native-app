import { getCalendars, getLocales } from 'expo-localization';

const fallbackLocaleTag = 'en';

export function getDeviceLocaleTag() {
  return getLocales()[0]?.languageTag ?? fallbackLocaleTag;
}

export function getDeviceTimeZone() {
  return getCalendars()[0]?.timeZone ?? undefined;
}
