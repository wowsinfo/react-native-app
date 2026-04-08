import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import { AppPalette, NavigationLightTheme } from '@/constants/theme';

export default function RootLayout() {
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(AppPalette.appBackground);
  }, []);

  return (
    <ThemeProvider value={NavigationLightTheme}>
      <Stack
        screenOptions={{
          headerTitle: 'WoWs Info Next',
          headerStyle: {
            backgroundColor: AppPalette.surface,
          },
          headerTintColor: AppPalette.text,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: AppPalette.appBackground,
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
