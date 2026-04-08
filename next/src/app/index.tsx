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
  getServerOptions,
  getStoreUrl,
  isLinkItem,
  type GameServer,
} from '@/features/home/content';
import { useAppPreferences } from '@/features/preferences/preferences-manager';
import { openUrl, shareUrl } from '@/lib/platform-actions';

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { palette, tintColor, resolvedTheme, t } = useAppPreferences();
  const styles = createStyles(palette, tintColor);
  const [server, setServer] = useState<GameServer>('asia');
  const localizedServerOptions = useMemo(() => getServerOptions(t), [t]);
  const sections = useMemo(() => getHomeSections(server, t), [server, t]);
  const compact = width < 900;

  async function handleRoutePress(routeKey: string, title?: string) {
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
        params: { title: t('home_item_rs_beta') },
      });
      return;
    }

    router.push({
      pathname: '/coming-soon',
      params: { title: title ?? routeKey },
    });
  }

  async function handleReviewPress() {
    Alert.alert(
      t('home_review_title'),
      t('home_review_body'),
      [
        {
          text: t('common_contact_developer'),
          onPress: () => {
            void openUrl(appLinks.developer);
          },
        },
        {
          text: t('common_open_store'),
          onPress: () => {
            void openUrl(getStoreUrl());
          },
        },
        {
          text: t('common_cancel'),
          style: 'cancel',
        },
      ],
    );
  }

  async function handleSharePress() {
    await shareUrl('WoWs Info Next', getStoreUrl());
  }

  async function handleItemPress(item: (typeof sections)[number]['items'][number]) {
    if (isLinkItem(item)) {
      await openUrl(item.url);
      return;
    }

    await handleRoutePress(item.routeKey, item.title);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>{t('home_eyebrow')}</Text>
          <Text style={styles.title}>{t('home_title')}</Text>
          <Text style={styles.subtitle}>{t('home_subtitle')}</Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.primaryAction} onPress={() => void handleRoutePress('Search')}>
            <Text style={styles.primaryActionLabel}>{t('common_search')}</Text>
            <Text style={styles.primaryActionHint}>{t('home_search_hint')}</Text>
          </Pressable>
          <Pressable style={styles.secondaryAction} onPress={() => void handleRoutePress('Settings')}>
            <Text style={styles.secondaryActionLabel}>{t('common_settings')}</Text>
          </Pressable>
          <Pressable style={styles.secondaryAction} onPress={() => void handleSharePress()}>
            <Text style={styles.secondaryActionLabel}>{t('common_share_app')}</Text>
          </Pressable>
        </View>

        <View style={styles.serverCard}>
          <Text style={styles.sectionTitle}>{t('common_server')}</Text>
          <Text style={styles.serverCopy}>{t('home_server_copy')}</Text>
          <View style={styles.serverRow}>
            {localizedServerOptions.map(option => {
              const active = option.value === server;
              return (
                <Pressable
                  key={option.value}
                  style={[styles.serverButton, active && styles.serverButtonActive]}
                  onPress={() => setServer(option.value)}
                >
                  <Text
                    style={[
                      styles.serverButtonLabel,
                      active && styles.serverButtonLabelActive,
                    ]}
                  >
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
                return (
                  <Pressable
                    key={item.title}
                    style={[styles.card, compact && styles.cardCompact]}
                    onPress={() => void handleItemPress(item)}
                  >
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardBody}>{item.description ?? t('common_not_migrated')}</Text>
                    <Text style={styles.cardHint}>
                      {isLinkItem(item)
                        ? t('common_open_link')
                        : t('common_open_placeholder')}
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

function createStyles(
  palette: ReturnType<typeof useAppPreferences>['palette'],
  tintColor: string,
) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: palette.appBackground,
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
      color: tintColor,
    },
    title: {
      fontSize: 34,
      fontWeight: '800',
      color: palette.text,
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 24,
      color: palette.muted,
    },
    actionRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    primaryAction: {
      flexGrow: 1,
      minWidth: 220,
      backgroundColor: tintColor,
      borderRadius: 18,
      padding: 18,
      gap: 4,
    },
    primaryActionLabel: {
      color: palette.inverseText,
      fontSize: 20,
      fontWeight: '800',
    },
    primaryActionHint: {
      color: palette.inverseText,
      fontSize: 14,
    },
    secondaryAction: {
      minWidth: 140,
      backgroundColor: palette.surface,
      borderRadius: 18,
      paddingHorizontal: 16,
      paddingVertical: 18,
      borderWidth: 1,
      borderColor: palette.border,
      justifyContent: 'center',
    },
    secondaryActionLabel: {
      color: palette.text,
      fontSize: 15,
      fontWeight: '700',
      textAlign: 'center',
    },
    serverCard: {
      backgroundColor: palette.surface,
      borderRadius: 18,
      padding: 18,
      gap: 10,
      borderWidth: 1,
      borderColor: palette.border,
    },
    serverCopy: {
      fontSize: 14,
      lineHeight: 20,
      color: palette.muted,
    },
    serverRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    serverButton: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: palette.border,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: palette.surfaceAlt,
    },
    serverButtonActive: {
      backgroundColor: tintColor,
      borderColor: tintColor,
    },
    serverButtonLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: palette.text,
    },
    serverButtonLabelActive: {
      color: palette.inverseText,
    },
    section: {
      gap: 12,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: palette.text,
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
      backgroundColor: palette.surface,
      borderRadius: 16,
      padding: 16,
      gap: 8,
      borderWidth: 1,
      borderColor: palette.border,
    },
    cardCompact: {
      width: '100%',
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: palette.text,
    },
    cardBody: {
      fontSize: 14,
      lineHeight: 20,
      color: palette.muted,
    },
    cardHint: {
      fontSize: 12,
      fontWeight: '700',
      color: tintColor,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
  });
}
