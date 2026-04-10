import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppPreferences } from '@/features/preferences/preferences-manager';

export default function ComingSoonScreen() {
  const router = useRouter();
  const { palette, tintColor, t } = useAppPreferences();
  const { title } = useLocalSearchParams<{ title?: string }>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.appBackground }}>
      <Stack.Screen
        options={{
          title: title ?? t('coming_soon_title'),
        }}
      />
      <View className="flex-1 justify-center gap-3 p-6">
        <Text className="text-[12px] font-bold" style={{ color: tintColor, letterSpacing: 1 }}>
          {t('coming_soon_title')}
        </Text>
        <Text className="text-[32px] font-extrabold" style={{ color: palette.text }}>
          {title ?? t('coming_soon_screen')}
        </Text>
        <Text className="text-[16px] leading-6" style={{ color: palette.muted }}>
          {t('coming_soon_body')}
        </Text>
        <Pressable
          className="mt-2 self-start rounded-full px-4 py-2.5"
          style={{ backgroundColor: tintColor }}
          onPress={() => router.back()}
        >
          <Text className="text-[15px] font-bold" style={{ color: palette.inverseText }}>
            {t('common_back_home')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
