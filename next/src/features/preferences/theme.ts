import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { type NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { vars } from 'nativewind';

export type Palette = {
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

export function createPalette(resolvedTheme: 'light' | 'dark', tintColor: string): Palette {
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

export function createNavigationTheme(
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

export function createStackScreenOptions(
  palette: Palette,
  overrides: NativeStackNavigationOptions = {},
): NativeStackNavigationOptions {
  return {
    headerStyle: {
      backgroundColor: palette.surface,
    },
    headerTintColor: palette.text,
    headerShadowVisible: false,
    contentStyle: {
      backgroundColor: palette.appBackground,
    },
    ...overrides,
  };
}

export function createThemeVariables(palette: Palette) {
  return vars({
    '--color-app': palette.appBackground,
    '--color-surface': palette.surface,
    '--color-surface-alt': palette.surfaceAlt,
    '--color-line': palette.border,
    '--color-line-soft': palette.borderSoft,
    '--color-foreground': palette.text,
    '--color-muted': palette.muted,
    '--color-accent': palette.accent,
    '--color-accent-muted': palette.accentMuted,
    '--color-accent-surface': palette.accentSurface,
    '--color-pressed': palette.pressed,
    '--color-warning-surface': palette.warningSurface,
    '--color-warning-border': palette.warningBorder,
    '--color-inverse': palette.inverseText,
  });
}
