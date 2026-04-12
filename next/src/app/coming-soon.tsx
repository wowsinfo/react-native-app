import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppPreferences } from '@/features/preferences/preferences-manager';
import { createStackScreenOptions } from '@/features/preferences/theme';

export default function ComingSoonScreen() {
  const router = useRouter();
  const { palette, tintColor, t } = useAppPreferences();
  const { title } = useLocalSearchParams<{ title?: string }>();

  return (
    <SafeAreaView className="flex-1 bg-app">
      <Stack.Screen
        options={createStackScreenOptions(palette, {
          title: title ?? t('coming_soon_title'),
        })}
      />
      <View className="flex-1 justify-center gap-3 p-6">
        <Text className="text-[12px] font-bold" style={{ color: tintColor, letterSpacing: 1 }}>
          {t('coming_soon_title')}
        </Text>
        <Text className="text-[32px] font-extrabold text-foreground">
          {title ?? t('coming_soon_screen')}
        </Text>
        <Text className="text-[16px] leading-6 text-muted">
          {t('coming_soon_body')}
        </Text>
        <Pressable
          className="mt-2 self-start rounded-full bg-accent px-4 py-2.5"
          style={{ backgroundColor: tintColor }}
          onPress={() => router.back()}
        >
          <Text className="text-[15px] font-bold text-inverse">
            {t('common_back_home')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
