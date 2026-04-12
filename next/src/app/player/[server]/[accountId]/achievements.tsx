import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  fetchPlayerAchievements,
  getWoWsAppKeyMessage,
  hasWoWsAppKey,
} from '@/features/player/api';
import { useAppStateManager } from '@/features/app-state/app-state-manager';
import {
  HeroCard,
  ListRow,
  PageScroll,
  Section,
  StateCard,
} from '@/features/player/ui';
import { useAppPreferences } from '@/features/preferences/preferences-manager';
import { createStackScreenOptions } from '@/features/preferences/theme';
import { isGameServer } from '@/features/home/content';

export default function PlayerAchievementsScreen() {
  const { apiLanguage } = useAppStateManager();
  const { palette, tintColor, t, tf } = useAppPreferences();
  const params = useLocalSearchParams<{
    server?: string;
    accountId?: string;
    nickname?: string;
  }>();
  const server = params.server && isGameServer(params.server) ? params.server : null;
  const accountId = params.accountId ?? null;
  const nickname = params.nickname ?? t('player_title');
  const [items, setItems] = useState<
    Array<{
      achievementId: string;
      count: number;
      meta: {name: string; description?: string} | null;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!server || !accountId) {
      setError(t('player_route_invalid'));
      setLoading(false);
      return () => {
        active = false;
      };
    }

    if (!hasWoWsAppKey()) {
      setError(getWoWsAppKeyMessage());
      setLoading(false);
      return () => {
        active = false;
      };
    }

    void fetchPlayerAchievements(server, accountId, apiLanguage)
      .then(result => {
        if (!active) {
          return;
        }

        setItems(result);
        setLoading(false);
      })
      .catch(fetchError => {
        if (!active) {
          return;
        }

        setError(
          fetchError instanceof Error ? fetchError.message : t('player_load_failed'),
        );
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accountId, apiLanguage, server, t]);

  return (
    <>
      <Stack.Screen
        options={createStackScreenOptions(palette, {
          title: t('player_achievements'),
        })}
      />
      <PageScroll>
        <HeroCard
          eyebrow={t('player_title')}
          title={tf('player_achievements_title_full', nickname)}
          body={t('player_achievements_body_full')}
          accentColor={tintColor}
        />
        {loading ? (
          <StateCard
            title={t('player_achievements_loading')}
            body={t('player_achievements_loading_body')}
          />
        ) : null}
        {error ? (
          <StateCard
            tone="warning"
            title={t('player_achievements_unavailable')}
            body={error}
          />
        ) : null}
        {!loading && !error ? (
          <Section
            title={tf('player_achievements_section_title', items.length)}
            subtitle={t('player_achievements_subtitle')}
          >
            {items.length === 0 ? (
              <StateCard
                title={t('player_achievements_empty_title')}
                body={t('player_achievements_empty_body')}
              />
            ) : (
              items.map(item => (
                <ListRow
                  key={item.achievementId}
                  title={item.meta?.name ?? item.achievementId}
                  description={
                    item.meta?.description ?? t('player_achievement_metadata_unavailable')
                  }
                  trailing={String(item.count)}
                />
              ))
            )}
          </Section>
        ) : null}
      </PageScroll>
    </>
  );
}
