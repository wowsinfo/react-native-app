import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  type TabTriggerSlotProps,
  type TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { ExternalLink } from './external-link';
import { useAppPreferences } from '@/features/preferences/preferences-manager';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <TabButton>Settings</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  const surfaceClassName = isFocused ? 'bg-pressed' : 'bg-surface-alt';
  const textClassName = isFocused ? 'text-foreground' : 'text-muted';

  return (
    <Pressable {...props} style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}>
      <View className={`rounded-2xl px-4 py-1 ${surfaceClassName}`}>
        <Text className={`text-[14px] font-medium leading-5 ${textClassName}`}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const { palette, t } = useAppPreferences();

  return (
    <View {...props} className="absolute w-full flex-row items-center justify-center p-4">
      <View className="w-full max-w-[800px] flex-row items-center gap-2 rounded-[32px] border border-line bg-surface px-8 py-2">
        <Text className="mr-auto text-[14px] font-bold leading-5 text-foreground">
          {t('app_title')}
        </Text>

        {props.children}

        <ExternalLink href="https://docs.expo.dev" asChild>
          <Pressable className="ml-4 flex-row items-center justify-center gap-1">
            <Text className="text-[14px] leading-[30px] text-foreground">
              Docs
            </Text>
            <SymbolView
              tintColor={palette.text}
              name={{ ios: 'arrow.up.right.square', web: 'link' }}
              size={12}
            />
          </Pressable>
        </ExternalLink>
      </View>
    </View>
  );
}
