import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  appLinks,
  getHomeSections,
  getStoreUrl,
  isLinkItem,
  serverOptions,
  type GameServer,
} from '@/features/home/content';
import { AppPalette } from '@/constants/theme';
import { openUrl, shareUrl } from '@/lib/platform-actions';

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [server, setServer] = useState<GameServer>('asia');
  const sections = useMemo(() => getHomeSections(server), [server]);
  const compact = width < 900;

  async function handleRoutePress(title: string, routeKey: string) {
    if (routeKey === 'Settings') {
      router.push('/settings');
      return;
    }

    if (routeKey === 'Search') {
      router.push('/search');
      return;
    }

    if (routeKey === 'RS') {
      router.push({
        pathname: '/coming-soon',
        params: { title: 'RS Beta' },
      });
      return;
    }

    router.push({
      pathname: '/coming-soon',
      params: { title: routeKey },
    });
  }

  async function handleReviewPress() {
    Alert.alert(
      'Review WoWs Info',
      'Choose whether to contact the developer or open the store listing.',
      [
        {
          text: 'Contact Developer',
          onPress: () => {
            void openUrl(appLinks.developer);
          },
        },
        {
          text: 'Open Store',
          onPress: () => {
            void openUrl(getStoreUrl());
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  }

  async function handleSharePress() {
    await shareUrl('WoWs Info Next', getStoreUrl());
  }

  async function handleItemPress(
    title: string,
    item: ReturnType<typeof getHomeSections>[number]['items'][number],
  ) {
    if (title === 'Leave Feedback') {
      await openUrl(appLinks.developer);
      return;
    }

    if (title === 'Latest Release') {
      await openUrl(appLinks.latestRelease);
      return;
    }

    if (title === 'Personal Rating') {
      await openUrl(appLinks.personalRating);
      return;
    }

    if (title === 'Share App') {
      await handleSharePress();
      return;
    }

    if (title === 'Leave a Review') {
      await handleReviewPress();
      return;
    }

    if (isLinkItem(item)) {
      await openUrl(item.url);
      return;
    }

    await handleRoutePress(item.title, item.routeKey);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Home Screen Port</Text>
          <Text style={styles.title}>WoWs Info Next</Text>
          <Text style={styles.subtitle}>
            Expo Router rewrite of the legacy home screen. This version is
            TypeScript-first, web-safe, and no longer depends on custom native
            bridge modules just to render.
          </Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            style={styles.primaryAction}
            onPress={() =>
              void handleRoutePress('Search', 'Search')
            }>
            <Text style={styles.primaryActionLabel}>Search</Text>
            <Text style={styles.primaryActionHint}>Player and clan lookup</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryAction}
            onPress={() =>
              void handleRoutePress('Settings', 'Settings')
            }>
            <Text style={styles.secondaryActionLabel}>Settings</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryAction}
            onPress={() => void handleSharePress()}>
            <Text style={styles.secondaryActionLabel}>Share App</Text>
          </Pressable>
        </View>

        <View style={styles.serverCard}>
          <Text style={styles.sectionTitle}>Server</Text>
          <Text style={styles.serverCopy}>
            Website links below update based on the selected game server.
          </Text>
          <View style={styles.serverRow}>
            {serverOptions.map(option => {
              const active = option.key === server;
              return (
                <Pressable
                  key={option.key}
                  style={[styles.serverButton, active && styles.serverButtonActive]}
                  onPress={() => setServer(option.key)}>
                  <Text
                    style={[
                      styles.serverButtonLabel,
                      active && styles.serverButtonLabelActive,
                    ]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {sections.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={[styles.grid, compact && styles.gridCompact]}>
              {section.items.map(item => {
                const description = item.description ?? 'Not migrated yet';
                return (
                  <Pressable
                    key={item.title}
                    style={[styles.card, compact && styles.cardCompact]}
                    onPress={() => void handleItemPress(item.title, item)}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardBody}>{description}</Text>
                    <Text style={styles.cardHint}>
                      {isLinkItem(item) ? 'Open link' : 'Open placeholder route'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppPalette.appBackground,
  },
  content: {
    padding: 24,
    gap: 20,
  },
  hero: {
    gap: 8,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: AppPalette.accent,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: AppPalette.text,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: AppPalette.muted,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  primaryAction: {
    flexGrow: 1,
    minWidth: 220,
    backgroundColor: AppPalette.accent,
    borderRadius: 18,
    padding: 18,
    gap: 4,
  },
  primaryActionLabel: {
    color: AppPalette.inverseText,
    fontSize: 20,
    fontWeight: '800',
  },
  primaryActionHint: {
    color: '#dceeff',
    fontSize: 14,
  },
  secondaryAction: {
    minWidth: 140,
    backgroundColor: AppPalette.surface,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: AppPalette.border,
    justifyContent: 'center',
  },
  secondaryActionLabel: {
    color: AppPalette.text,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  serverCard: {
    backgroundColor: AppPalette.surface,
    borderRadius: 18,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: AppPalette.border,
  },
  serverCopy: {
    fontSize: 14,
    lineHeight: 20,
    color: AppPalette.muted,
  },
  serverRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serverButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: AppPalette.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: AppPalette.surfaceAlt,
  },
  serverButtonActive: {
    backgroundColor: AppPalette.accent,
    borderColor: AppPalette.accent,
  },
  serverButtonLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: AppPalette.text,
  },
  serverButtonLabelActive: {
    color: AppPalette.inverseText,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: AppPalette.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCompact: {
    flexDirection: 'column',
  },
  card: {
    width: '48%',
    minWidth: 240,
    backgroundColor: AppPalette.surface,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: AppPalette.border,
  },
  cardCompact: {
    width: '100%',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppPalette.text,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
    color: AppPalette.muted,
  },
  cardHint: {
    fontSize: 12,
    fontWeight: '700',
    color: AppPalette.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
