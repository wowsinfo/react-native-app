import { StatusBar } from 'expo-status-bar';
import { type ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const playerPalette = {
  background: '#f2efe6',
  surface: '#fffaf0',
  border: '#e5d8bf',
  text: '#1f2f25',
  muted: '#5b675f',
  chip: '#f8f1e3',
  pressed: '#f5eee0',
} as const;

export function PageScroll({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
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
  return (
    <View style={[styles.heroCard, { borderColor: accentColor }]}>
      <Text style={[styles.heroEyebrow, { color: accentColor }]}>{eyebrow}</Text>
      <Text style={styles.heroTitle}>{title}</Text>
      {body ? <Text style={styles.heroBody}>{body}</Text> : null}
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
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

export function MetricGrid({ children }: { children: ReactNode }) {
  return <View style={styles.metricGrid}>{children}</View>;
}

export function MetricTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metricTile}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export function ActionTile({
  title,
  body,
  onPress,
  accentColor,
}: {
  title: string;
  body: string;
  onPress?: () => void;
  accentColor: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionTile,
        pressed && onPress ? styles.pressed : null,
      ]}
      onPress={onPress}
    >
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionBody}>{body}</Text>
      <Text style={[styles.actionHint, { color: accentColor }]}>Open</Text>
    </Pressable>
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
  return (
    <Pressable
      style={({ pressed }) => [styles.listRow, pressed && onPress ? styles.pressed : null]}
      onPress={onPress}
    >
      <View style={styles.listCopy}>
        <Text style={styles.listTitle}>{title}</Text>
        {description ? <Text style={styles.listDescription}>{description}</Text> : null}
      </View>
      {trailing ? <Text style={styles.listTrailing}>{trailing}</Text> : null}
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
  return (
    <View
      style={[
        styles.stateCard,
        tone === 'warning' ? styles.stateCardWarning : null,
      ]}
    >
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateBody}>{body}</Text>
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
  return (
    <View style={styles.chipRow}>
      {options.map(option => {
        const active = option.value === value;

        return (
          <Pressable
            key={option.value}
            style={[
              styles.chip,
              active
                ? {
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                  }
                : null,
            ]}
            onPress={() => onChange(option.value)}
          >
            <Text style={[styles.chipLabel, active ? styles.chipLabelActive : null]}>
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
  const maxValue = Math.max(...items.map(item => item.value), 1);

  return (
    <View style={styles.barList}>
      {items.map(item => (
        <View key={item.id} style={styles.barRow}>
          <View style={styles.barHeader}>
            <Text style={styles.barLabel}>{item.label}</Text>
            <Text style={styles.barValue}>{renderValue(item.value)}</Text>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  backgroundColor: accentColor,
                  width: `${Math.max((item.value / maxValue) * 100, 6)}%`,
                },
              ]}
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
  return <View style={[styles.inlineGroup, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: playerPalette.background,
  },
  content: {
    padding: 24,
    gap: 20,
  },
  heroCard: {
    backgroundColor: playerPalette.surface,
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    gap: 8,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: playerPalette.text,
  },
  heroBody: {
    fontSize: 15,
    lineHeight: 22,
    color: playerPalette.muted,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    alignItems: 'center',
    gap: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: playerPalette.text,
    textAlign: 'center',
  },
  sectionSubtitle: {
    maxWidth: 680,
    fontSize: 13,
    lineHeight: 19,
    color: playerPalette.muted,
    textAlign: 'center',
  },
  sectionBody: {
    backgroundColor: playerPalette.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: playerPalette.border,
    overflow: 'hidden',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 18,
  },
  metricTile: {
    minWidth: 130,
    flexGrow: 1,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eadfcf',
    padding: 14,
    gap: 6,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: playerPalette.muted,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: playerPalette.text,
  },
  actionTile: {
    width: '48%',
    minWidth: 220,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eadfcf',
    padding: 16,
    gap: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: playerPalette.text,
  },
  actionBody: {
    fontSize: 14,
    lineHeight: 20,
    color: playerPalette.muted,
  },
  actionHint: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  listRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#efe5d3',
  },
  listCopy: {
    flex: 1,
    gap: 4,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: playerPalette.text,
  },
  listDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: playerPalette.muted,
  },
  listTrailing: {
    fontSize: 13,
    fontWeight: '700',
    color: playerPalette.muted,
  },
  stateCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: playerPalette.border,
    backgroundColor: playerPalette.surface,
    padding: 18,
    gap: 8,
  },
  stateCardWarning: {
    borderColor: '#c79f59',
    backgroundColor: '#fff7e8',
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: playerPalette.text,
  },
  stateBody: {
    fontSize: 14,
    lineHeight: 20,
    color: playerPalette.muted,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d6c6a7',
    backgroundColor: playerPalette.chip,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5f4a23',
  },
  chipLabelActive: {
    color: '#fffdf8',
  },
  barList: {
    gap: 12,
    padding: 18,
  },
  barRow: {
    gap: 6,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  barLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: playerPalette.text,
  },
  barValue: {
    fontSize: 13,
    fontWeight: '700',
    color: playerPalette.muted,
  },
  barTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#ecdfc8',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
  inlineGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pressed: {
    backgroundColor: playerPalette.pressed,
  },
});
