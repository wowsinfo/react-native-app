import { SymbolView } from 'expo-symbols';
import { PropsWithChildren, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useAppPreferences } from '@/features/preferences/preferences-manager';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { palette } = useAppPreferences();

  return (
    <View>
      <Pressable
        className="flex-row items-center gap-2"
        style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
        onPress={() => setIsOpen((value) => !value)}>
        <View className="size-6 items-center justify-center rounded-xl bg-surface">
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={14}
            weight="bold"
            tintColor={palette.text}
            style={{ transform: [{ rotate: isOpen ? '-90deg' : '90deg' }] }}
          />
        </View>

        <Text className="text-[14px] font-medium leading-5 text-foreground">
          {title}
        </Text>
      </Pressable>
      {isOpen && (
        <Animated.View entering={FadeIn.duration(200)}>
          <View className="ml-6 mt-4 rounded-2xl bg-surface p-6">
            {children}
          </View>
        </Animated.View>
      )}
    </View>
  );
}
