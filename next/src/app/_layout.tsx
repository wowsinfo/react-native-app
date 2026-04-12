import '@/global.css';

import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { View } from 'react-native';

import { AppStateProvider } from '@/features/app-state/app-state-manager';
import { PreferencesProvider, useAppPreferences } from '@/features/preferences/preferences-manager';
import {
  createStackScreenOptions,
  createThemeVariables,
} from '@/features/preferences/theme';

export default function RootLayout() {
  return (
    <AppStateProvider>
      <PreferencesProvider>
        <ManagedRootLayout />
      </PreferencesProvider>
    </AppStateProvider>
  );
}

function ManagedRootLayout() {
  const { navigationTheme, palette, t } = useAppPreferences();
  const themeVariables = createThemeVariables(palette);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(palette.appBackground);
  }, [palette.appBackground]);

  return (
    <View className="flex-1 bg-app" style={themeVariables}>
      <ThemeProvider value={navigationTheme}>
        <Stack
          screenOptions={createStackScreenOptions(palette, {
            headerTitle: t('app_title'),
          })}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </ThemeProvider>
    </View>
  );
}
