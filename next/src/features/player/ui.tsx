import { StatusBar } from 'expo-status-bar';
import { type ReactNode } from 'react';
import { Image, Pressable, ScrollView, Text, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getLegacyIconSource,
  type LegacyIconName,
} from '@/features/player/legacy-icons';
import { useAppPreferences } from '@/features/preferences/preferences-manager';

export function PageScroll({ children }: { children: ReactNode }) {
  const { palette, resolvedTheme } = useAppPreferences();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.appBackground }} edges={['bottom']}>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView>
        <View className="gap-5 p-6">{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function HeroCard({
  eyebrow,
  title,
  body,
  accentColor,
  children,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  accentColor: string;
  children?: ReactNode;
}) {
  const { palette } = useAppPreferences();

  return (
    <View
      className="gap-2 rounded-[18px] border p-5"
      style={{ backgroundColor: palette.surface, borderColor: accentColor }}
    >
      <Text
        className="text-[12px] font-extrabold uppercase"
        style={{ color: accentColor, letterSpacing: 1.4 }}
      >
        {eyebrow}
      </Text>
      <Text className="text-[28px] font-extrabold" style={{ color: palette.text }}>
        {title}
      </Text>
      {body ? (
        <Text className="text-[15px] leading-[22px]" style={{ color: palette.muted }}>
          {body}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

export function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { palette } = useAppPreferences();

  return (
    <View className="gap-[10px]">
      <View className="items-center gap-1">
        <Text className="text-center text-[20px] font-extrabold" style={{ color: palette.text }}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            className="max-w-[680px] text-center text-[13px] leading-[19px]"
            style={{ color: palette.muted }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View
        className="overflow-hidden rounded-[18px] border"
        style={{ backgroundColor: palette.surface, borderColor: palette.border }}
      >
        {children}
      </View>
    </View>
  );
}

export function MetricGrid({ children }: { children: ReactNode }) {
  return <View className="flex-row flex-wrap gap-3 p-[18px]">{children}</View>;
}

export function MetricTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const { palette } = useAppPreferences();

  return (
    <View
      className="min-w-[130px] grow gap-1.5 rounded-[14px] border p-[14px]"
      style={{ backgroundColor: palette.surface, borderColor: palette.border }}
    >
      <Text
        className="text-[12px] font-bold uppercase"
        style={{ color: palette.muted, letterSpacing: 0.8 }}
      >
        {label}
      </Text>
      <Text className="text-[20px] font-extrabold" style={{ color: palette.text }}>
        {value}
      </Text>
    </View>
  );
}

export function ActionTile({
  title,
  body,
  onPress,
  accentColor,
  iconName,
}: {
  title: string;
  body: string;
  onPress?: () => void;
  accentColor: string;
  iconName?: LegacyIconName;
}) {
  const { palette, t } = useAppPreferences();

  return (
    <Pressable
      className="min-w-[220px] grow gap-2 rounded-2xl border p-4"
      style={({ pressed }) => [
        {
          width: '48%',
          backgroundColor: pressed && onPress ? palette.pressed : palette.surface,
          borderColor: palette.border,
        },
      ]}
      onPress={onPress}
    >
      {iconName ? (
        <Image
          source={getLegacyIconSource(iconName)}
          style={{ width: 30, height: 30, tintColor: accentColor }}
          resizeMode="contain"
        />
      ) : null}
      <Text className="text-[16px] font-bold" style={{ color: palette.text }}>
        {title}
      </Text>
      <Text className="text-[14px] leading-5" style={{ color: palette.muted }}>
        {body}
      </Text>
      <Text
        className="text-[12px] font-extrabold uppercase"
        style={{ color: accentColor, letterSpacing: 1 }}
      >
        {t('common_open')}
      </Text>
    </Pressable>
  );
}

export function ClassicSummaryStrip({
  items,
  accentColor,
}: {
  items: Array<{icon: LegacyIconName; label: string; value: string}>;
  accentColor: string;
}) {
  const { palette } = useAppPreferences();

  if (items.length === 0) {
    return null;
  }

  return (
    <View className="flex-row flex-wrap justify-center gap-3 p-[18px]">
      {items.map(item => (
        <View
          key={`${item.icon}-${item.label}`}
          className="max-w-[160px] min-w-[110px] grow items-center gap-1 rounded-[14px] border px-3 py-[14px]"
          style={{ backgroundColor: palette.surface, borderColor: palette.border }}
        >
          <Image
            source={getLegacyIconSource(item.icon)}
            style={{ width: 28, height: 28, tintColor: accentColor }}
            resizeMode="contain"
          />
          <Text className="text-center text-[18px] font-extrabold" style={{ color: palette.text }}>
            {item.value}
          </Text>
          <Text
            className="text-center text-[11px] font-bold uppercase"
            style={{ color: palette.muted, letterSpacing: 0.6 }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function ListRow({
  title,
  description,
  trailing,
  onPress,
}: {
  title: string;
  description?: string;
  trailing?: string;
  onPress?: () => void;
}) {
  const { palette } = useAppPreferences();

  return (
    <Pressable
      className="min-h-[72px] flex-row items-center gap-3 border-b px-[18px] py-4"
      style={({ pressed }) => [
        {
          backgroundColor: pressed && onPress ? palette.pressed : palette.surface,
          borderBottomColor: palette.borderSoft,
        },
      ]}
      onPress={onPress}
    >
      <View className="flex-1 gap-1">
        <Text className="text-[16px] font-bold" style={{ color: palette.text }}>
          {title}
        </Text>
        {description ? (
          <Text className="text-[13px] leading-[18px]" style={{ color: palette.muted }}>
            {description}
          </Text>
        ) : null}
      </View>
      {trailing ? (
        <Text className="text-[13px] font-bold" style={{ color: palette.muted }}>
          {trailing}
        </Text>
      ) : null}
    </Pressable>
  );
}

export function StateCard({
  title,
  body,
  tone = 'default',
}: {
  title: string;
  body: string;
  tone?: 'default' | 'warning';
}) {
  const { palette } = useAppPreferences();
  const warning = tone === 'warning';

  return (
    <View
      className="gap-2 rounded-[18px] border p-[18px]"
      style={{
        borderColor: warning ? palette.warningBorder : palette.border,
        backgroundColor: warning ? palette.warningSurface : palette.surface,
      }}
    >
      <Text className="text-[16px] font-extrabold" style={{ color: palette.text }}>
        {title}
      </Text>
      <Text className="text-[14px] leading-5" style={{ color: palette.muted }}>
        {body}
      </Text>
    </View>
  );
}

export function ChipRow<T extends string>({
  value,
  options,
  onChange,
  accentColor,
}: {
  value: T;
  options: Array<{value: T; label: string}>;
  onChange: (next: T) => void;
  accentColor: string;
}) {
  const { palette } = useAppPreferences();

  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map(option => {
        const active = option.value === value;

        return (
          <Pressable
            key={option.value}
            className="rounded-full border px-3 py-2"
            style={{
              borderColor: active ? accentColor : palette.border,
              backgroundColor: active ? accentColor : palette.surfaceAlt,
            }}
            onPress={() => onChange(option.value)}
          >
            <Text
              className="text-[13px] font-bold"
              style={{ color: active ? palette.inverseText : palette.text }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function BarList({
  items,
  accentColor,
  renderValue,
}: {
  items: Array<{id: string; label: string; value: number}>;
  accentColor: string;
  renderValue: (value: number) => string;
}) {
  const { palette } = useAppPreferences();
  const maxValue = Math.max(...items.map(item => item.value), 1);

  return (
    <View className="gap-3 p-[18px]">
      {items.map(item => (
        <View key={item.id} className="gap-1.5">
          <View className="flex-row justify-between gap-3">
            <Text className="flex-1 text-[14px] font-bold" style={{ color: palette.text }}>
              {item.label}
            </Text>
            <Text className="text-[13px] font-bold" style={{ color: palette.muted }}>
              {renderValue(item.value)}
            </Text>
          </View>
          <View
            className="h-[10px] overflow-hidden rounded-full"
            style={{ backgroundColor: palette.borderSoft }}
          >
            <View
              className="h-full rounded-full"
              style={{
                backgroundColor: accentColor,
                width: `${Math.max((item.value / maxValue) * 100, 6)}%`,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

export function InlineGroup({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View className="flex-row flex-wrap gap-3" style={style}>
      {children}
    </View>
  );
}
