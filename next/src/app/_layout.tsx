import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import { PreferencesProvider, useAppPreferences } from '@/features/preferences/preferences-manager';

export default function RootLayout() {
  return (
    <PreferencesProvider>
      <ManagedRootLayout />
    </PreferencesProvider>
  );
}

function ManagedRootLayout() {
  const { navigationTheme, palette, t } = useAppPreferences();

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(palette.appBackground);
  }, [palette.appBackground]);

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          headerTitle: t('app_title'),
          headerStyle: {
            backgroundColor: palette.surface,
          },
          headerTintColor: palette.text,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: palette.appBackground,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
