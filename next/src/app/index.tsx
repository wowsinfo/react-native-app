import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
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
} from '@/features/home/content';
import { useAppStateManager } from '@/features/app-state/app-state-manager';
import { useAppPreferences } from '@/features/preferences/preferences-manager';
import { openUrl, shareUrl } from '@/lib/platform-actions';

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { gameServer, setGameServer } = useAppStateManager();
  const { tintColor, resolvedTheme, t } = useAppPreferences();
  const localizedServerOptions = useMemo(() => getServerOptions(t), [t]);
  const sections = useMemo(() => getHomeSections(gameServer, t), [gameServer, t]);
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

    if (item.routeKey === 'Review') {
      await handleReviewPress();
      return;
    }

    await handleRoutePress(item.routeKey, item.title);
  }

  return (
    <SafeAreaView className="flex-1 bg-app">
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView>
        <View className="gap-5 p-6">
          <View className="gap-2">
            <Text
              className="text-[12px] font-bold uppercase"
              style={{ color: tintColor, letterSpacing: 1.4 }}
            >
              {t('home_eyebrow')}
            </Text>
            <Text className="text-[34px] font-extrabold text-foreground">
              {t('home_title')}
            </Text>
            <Text className="text-[16px] leading-6 text-muted">
              {t('home_subtitle')}
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-3">
            <Pressable
              className="min-w-[220px] grow gap-1 rounded-[18px] bg-accent p-[18px]"
              style={{ backgroundColor: tintColor }}
              onPress={() => void handleRoutePress('Search')}
            >
              <Text className="text-[20px] font-extrabold text-inverse">
                {t('common_search')}
              </Text>
              <Text className="text-[14px] text-inverse">
                {t('home_search_hint')}
              </Text>
            </Pressable>
            <Pressable
              className="min-w-[140px] justify-center rounded-[18px] border border-line bg-surface px-4 py-[18px]"
              onPress={() => void handleRoutePress('Settings')}
            >
              <Text className="text-center text-[15px] font-bold text-foreground">
                {t('common_settings')}
              </Text>
            </Pressable>
            <Pressable
              className="min-w-[140px] justify-center rounded-[18px] border border-line bg-surface px-4 py-[18px]"
              onPress={() => void handleSharePress()}
            >
              <Text className="text-center text-[15px] font-bold text-foreground">
                {t('common_share_app')}
              </Text>
            </Pressable>
          </View>

          <View className="gap-[10px] rounded-[18px] border border-line bg-surface p-[18px]">
            <Text className="text-[20px] font-extrabold text-foreground">
              {t('common_server')}
            </Text>
            <Text className="text-[14px] leading-5 text-muted">
              {t('home_server_copy')}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {localizedServerOptions.map(option => {
                const active = option.value === gameServer;

                return (
                  <Pressable
                    key={option.value}
                    className={`rounded-full border px-3 py-2 ${active ? 'bg-accent' : 'border-line bg-surface-alt'}`}
                    style={{
                      borderColor: active ? tintColor : undefined,
                    }}
                    onPress={() => setGameServer(option.value)}
                  >
                    <Text className={`text-[13px] font-bold ${active ? 'text-inverse' : 'text-foreground'}`}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {sections.map(section => (
            <View key={section.title} className="gap-3">
              <Text className="text-[20px] font-extrabold text-foreground">
                {section.title}
              </Text>
              <View className={`flex-wrap gap-3 ${compact ? 'flex-col' : 'flex-row'}`}>
                {section.items.map(item => (
                  <Pressable
                    key={item.title}
                    className="gap-2 rounded-2xl border border-line bg-surface p-4"
                    style={{
                      width: compact ? '100%' : '48%',
                      minWidth: 240,
                    }}
                    onPress={() => void handleItemPress(item)}
                  >
                    <Text className="text-[16px] font-bold text-foreground">
                      {item.title}
                    </Text>
                    <Text className="text-[14px] leading-5 text-muted">
                      {item.description ?? t('common_not_migrated')}
                    </Text>
                    <Text
                      className="text-[12px] font-bold uppercase"
                      style={{ color: tintColor, letterSpacing: 0.8 }}
                    >
                      {isLinkItem(item) ? t('common_open_link') : t('common_open_placeholder')}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
