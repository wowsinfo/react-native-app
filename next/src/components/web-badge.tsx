import { version } from 'expo/package.json';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { useAppPreferences } from '@/features/preferences/preferences-manager';

export function WebBadge() {
  const { resolvedTheme } = useAppPreferences();

  return (
    <View className="items-center gap-2 p-8">
      <Text className="font-mono text-[12px] text-center text-muted">
        v{version}
      </Text>
      <Image
        source={
          resolvedTheme === 'dark'
            ? require('@/assets/images/expo-badge-white.png')
            : require('@/assets/images/expo-badge.png')
        }
        style={{ width: 123, aspectRatio: 123 / 24 }}
      />
    </View>
  );
}
