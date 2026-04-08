/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';
import { DefaultTheme, type Theme } from '@react-navigation/native';

export const AppPalette = {
  appBackground: '#f5f5f5',
  surface: '#ffffff',
  surfaceAlt: '#fafafa',
  border: '#e0e0e0',
  borderSoft: '#eeeeee',
  text: '#212121',
  muted: '#616161',
  accent: '#2196f3',
  accentMuted: '#64b5f6',
  accentSurface: '#e3f2fd',
  pressed: '#eeeeee',
  warningSurface: '#fff8e1',
  warningBorder: '#ffcc80',
  inverseText: '#ffffff',
} as const;

export const Colors = {
  light: {
    text: AppPalette.text,
    background: AppPalette.appBackground,
    backgroundElement: AppPalette.surface,
    backgroundSelected: AppPalette.pressed,
    textSecondary: AppPalette.muted,
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const NavigationLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: AppPalette.accent,
    background: AppPalette.appBackground,
    card: AppPalette.surface,
    text: AppPalette.text,
    border: AppPalette.border,
    notification: AppPalette.accent,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
