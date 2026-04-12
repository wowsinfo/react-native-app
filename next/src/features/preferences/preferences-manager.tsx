import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { type Theme } from '@react-navigation/native';
import { useLocales } from 'expo-localization';
import { useColorScheme } from 'react-native';

import {
  readStoredString,
  writeStoredString,
} from '@/features/app-state/storage';
import { messages, type MessageKey, type MessageLanguage } from '@/features/preferences/messages';
import { resolveSystemLanguage } from '@/features/preferences/system-language';
import {
  createNavigationTheme,
  createPalette,
  type Palette,
} from '@/features/preferences/theme';
import { getTintValue, type TintKey } from '@/features/settings/content';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AppLanguagePreference = 'system' | MessageLanguage;

type PreferencesContextValue = {
  themeMode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setThemeMode: (mode: ThemeMode) => void;
  tintKey: TintKey;
  tintColor: string;
  setTintKey: (key: TintKey) => void;
  appLanguage: AppLanguagePreference;
  resolvedLanguage: MessageLanguage;
  setAppLanguage: (language: AppLanguagePreference) => void;
  palette: Palette;
  navigationTheme: Theme;
  t: (key: MessageKey) => string;
  tf: (key: MessageKey, ...values: Array<string | number>) => string;
};

const THEME_MODE_KEY = 'wowsinfo.themeMode';
const TINT_KEY = 'wowsinfo.tintKey';
const LANGUAGE_KEY = 'wowsinfo.language';

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function formatMessage(
  message: string,
  values: Array<string | number>,
) {
  let formatted = String(message);

  values.forEach((value, index) => {
    const token = `{${index}}`;
    formatted = formatted.split(token).join(String(value));
  });

  return formatted;
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const locales = useLocales();
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(
    readStoredString(THEME_MODE_KEY, 'system') as ThemeMode,
  );
  const [tintKey, setTintKeyState] = useState<TintKey>(
    readStoredString(TINT_KEY, 'blue') as TintKey,
  );
  const [appLanguage, setAppLanguageState] = useState<AppLanguagePreference>(
    readStoredString(LANGUAGE_KEY, 'system') as AppLanguagePreference,
  );

  const resolvedTheme =
    themeMode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : themeMode;
  const resolvedLanguage =
    appLanguage === 'system' ? resolveSystemLanguage(locales) : appLanguage;
  const tintColor = getTintValue(tintKey);
  const palette = useMemo(
    () => createPalette(resolvedTheme, tintColor),
    [resolvedTheme, tintColor],
  );
  const navigationTheme = useMemo(
    () => createNavigationTheme(resolvedTheme, palette),
    [palette, resolvedTheme],
  );

  useEffect(() => {
    writeStoredString(THEME_MODE_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    writeStoredString(TINT_KEY, tintKey);
  }, [tintKey]);

  useEffect(() => {
    writeStoredString(LANGUAGE_KEY, appLanguage);
  }, [appLanguage]);

  const value = useMemo<PreferencesContextValue>(() => {
    const resolvedMessages = messages[resolvedLanguage] as Partial<
      Record<MessageKey, string>
    >;

    return {
      themeMode,
      resolvedTheme,
      setThemeMode: setThemeModeState,
      tintKey,
      tintColor,
      setTintKey: setTintKeyState,
      appLanguage,
      resolvedLanguage,
      setAppLanguage: setAppLanguageState,
      palette,
      navigationTheme,
      t: key => resolvedMessages[key] ?? messages.en[key] ?? key,
      tf: (key, ...values) =>
        formatMessage(resolvedMessages[key] ?? messages.en[key] ?? key, values),
    };
  }, [
    appLanguage,
    navigationTheme,
    palette,
    resolvedLanguage,
    resolvedTheme,
    themeMode,
    tintColor,
    tintKey,
  ]);

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function useAppPreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error('useAppPreferences must be used inside PreferencesProvider.');
  }

  return context;
}
