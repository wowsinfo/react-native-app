import { appLinks, serverOptions, type GameServer } from '@/features/home/content';

export type ApiLanguage = 'en' | 'ja' | 'zh-cn' | 'zh-tw';
export type AppLanguage = 'en' | 'ja' | 'zh' | 'zh-hant';
export type TintKey =
  | 'red'
  | 'pink'
  | 'purple'
  | 'indigo'
  | 'blue'
  | 'teal'
  | 'green'
  | 'amber'
  | 'orange'
  | 'brown'
  | 'blueGrey';

export type ChoiceOption<T extends string> = {
  value: T;
  label: string;
};

export type TintOption = {
  key: TintKey;
  name: string;
  value: string;
};

export const defaultSettingsState = {
  server: 'asia' as GameServer,
  apiLanguage: 'en' as ApiLanguage,
  appLanguage: 'en' as AppLanguage,
  darkMode: false,
  swapButtons: false,
  tint: 'brown' as TintKey,
};

export const settingsLinks = {
  developer: appLinks.developer,
  reportIssue: `${appLinks.github}/issues/new`,
  github: appLinks.github,
  latestRelease: appLinks.latestRelease,
} as const;

export const gameServerOptions: ChoiceOption<GameServer>[] = serverOptions.map(
  option => ({
    value: option.key,
    label: option.label,
  }),
);

export const apiLanguageOptions: ChoiceOption<ApiLanguage>[] = [
  { value: 'en', label: 'English' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh-cn', label: 'Simplified Chinese' },
  { value: 'zh-tw', label: 'Traditional Chinese' },
];

export const appLanguageOptions: ChoiceOption<AppLanguage>[] = [
  { value: 'en', label: 'English' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Simplified Chinese' },
  { value: 'zh-hant', label: 'Traditional Chinese' },
];

export const tintOptions: TintOption[] = [
  { key: 'red', name: 'Red', value: '#bf3b38' },
  { key: 'pink', name: 'Pink', value: '#b3556f' },
  { key: 'purple', name: 'Purple', value: '#6f4d9b' },
  { key: 'indigo', name: 'Indigo', value: '#42568f' },
  { key: 'blue', name: 'Blue', value: '#2f6690' },
  { key: 'teal', name: 'Teal', value: '#2d7d76' },
  { key: 'green', name: 'Green', value: '#4e7d46' },
  { key: 'amber', name: 'Amber', value: '#b67a18' },
  { key: 'orange', name: 'Orange', value: '#bb5d2d' },
  { key: 'brown', name: 'Brown', value: '#8b5e1a' },
  { key: 'blueGrey', name: 'Blue Grey', value: '#556977' },
];

export function getTintValue(key: TintKey) {
  return tintOptions.find(option => option.key === key)?.value ?? '#8b5e1a';
}
