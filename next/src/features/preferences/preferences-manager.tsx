import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

import {
  readStoredString,
  writeStoredString,
} from '@/features/app-state/storage';
import { messages, type MessageKey, type MessageLanguage } from '@/features/preferences/messages';
import { getTintValue, type TintKey } from '@/features/settings/content';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AppLanguagePreference = 'system' | MessageLanguage;

type Palette = {
  appBackground: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderSoft: string;
  text: string;
  muted: string;
  accent: string;
  accentMuted: string;
  accentSurface: string;
  pressed: string;
  warningSurface: string;
  warningBorder: string;
  inverseText: string;
};

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

function detectSystemLanguage(): MessageLanguage {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();

  if (locale.startsWith('ja')) {
    return 'ja';
  }

  if (locale.startsWith('zh')) {
    if (
      locale.includes('hant') ||
      locale.includes('tw') ||
      locale.includes('hk') ||
      locale.includes('mo')
    ) {
      return 'zh-hant';
    }

    return 'zh';
  }

  return 'en';
}

function createPalette(resolvedTheme: 'light' | 'dark', tintColor: string): Palette {
  if (resolvedTheme === 'dark') {
    return {
      appBackground: '#121212',
      surface: '#1c1c1c',
      surfaceAlt: '#242424',
      border: '#2f2f2f',
      borderSoft: '#292929',
      text: '#f5f5f5',
      muted: '#bdbdbd',
      accent: tintColor,
      accentMuted: tintColor,
      accentSurface: '#10243b',
      pressed: '#2a2a2a',
      warningSurface: '#3b2e12',
      warningBorder: '#c58b2a',
      inverseText: '#ffffff',
    };
  }

  return {
    appBackground: '#f5f5f5',
    surface: '#ffffff',
    surfaceAlt: '#fafafa',
    border: '#e0e0e0',
    borderSoft: '#eeeeee',
    text: '#212121',
    muted: '#616161',
    accent: tintColor,
    accentMuted: '#64b5f6',
    accentSurface: '#e3f2fd',
    pressed: '#eeeeee',
    warningSurface: '#fff8e1',
    warningBorder: '#ffcc80',
    inverseText: '#ffffff',
  };
}

function createNavigationTheme(
  resolvedTheme: 'light' | 'dark',
  palette: Palette,
): Theme {
  const baseTheme = resolvedTheme === 'dark' ? DarkTheme : DefaultTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: palette.accent,
      background: palette.appBackground,
      card: palette.surface,
      text: palette.text,
      border: palette.border,
      notification: palette.accent,
    },
  };
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
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
    appLanguage === 'system' ? detectSystemLanguage() : appLanguage;
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
