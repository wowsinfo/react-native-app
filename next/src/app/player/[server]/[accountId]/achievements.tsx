import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  fetchPlayerAchievements,
  getWoWsAppKeyMessage,
  hasWoWsAppKey,
} from '@/features/player/api';
import {
  HeroCard,
  ListRow,
  PageScroll,
  Section,
  StateCard,
} from '@/features/player/ui';
import { AppPalette } from '@/constants/theme';
import { isGameServer } from '@/features/home/content';

const accentColor = AppPalette.accent;

export default function PlayerAchievementsScreen() {
  const params = useLocalSearchParams<{
    server?: string;
    accountId?: string;
    nickname?: string;
  }>();
  const server = params.server && isGameServer(params.server) ? params.server : null;
  const accountId = params.accountId ?? null;
  const nickname = params.nickname ?? 'Player';
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
      setError('Invalid player route.');
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

    void fetchPlayerAchievements(server, accountId)
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

        setError(fetchError instanceof Error ? fetchError.message : 'Achievement load failed.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accountId, server]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Achievements',
          headerStyle: {backgroundColor: AppPalette.surface},
          headerTintColor: AppPalette.text,
          headerShadowVisible: false,
        }}
      />
      <PageScroll>
        <HeroCard
          eyebrow="Player"
          title={`${nickname} achievements`}
          body="Achievement counts are live API data matched against the encyclopedia metadata."
          accentColor={accentColor}
        />
        {loading ? (
          <StateCard title="Loading achievements" body="Fetching battle achievement totals." />
        ) : null}
        {error ? <StateCard tone="warning" title="Achievements unavailable" body={error} /> : null}
        {!loading && !error ? (
          <Section
            title={`Achievements - ${items.length}`}
            subtitle="This replaces the old grid with a route that also works on web."
          >
            {items.length === 0 ? (
              <StateCard
                title="No achievements"
                body="This player has no exposed battle achievement data."
              />
            ) : (
              items.map(item => (
                <ListRow
                  key={item.achievementId}
                  title={item.meta?.name ?? item.achievementId}
                  description={item.meta?.description ?? 'Achievement metadata unavailable.'}
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
