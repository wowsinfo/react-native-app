import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { fetchPlayerRank, getWoWsAppKeyMessage, hasWoWsAppKey } from '@/features/player/api';
import { formatNumber } from '@/features/player/format';
import { HeroCard, ListRow, PageScroll, Section, StateCard } from '@/features/player/ui';
import { AppPalette } from '@/constants/theme';
import { isGameServer } from '@/features/home/content';

const accentColor = AppPalette.accent;

export default function PlayerRankScreen() {
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
      season: string;
      rank: number;
      shipCount: number;
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

    void fetchPlayerRank(server, accountId)
      .then(result => {
        if (!active) {
          return;
        }

        const shipCounts = result.ships.reduce<Record<string, number>>((all, ship) => {
          for (const season of Object.keys(ship.seasons ?? {})) {
            all[season] = (all[season] ?? 0) + 1;
          }

          return all;
        }, {});

        const nextItems = Object.entries(result.seasons)
          .map(([season, seasonInfo]) => ({
            season,
            rank: seasonInfo.rank_info?.rank ?? 0,
            shipCount: shipCounts[season] ?? 0,
          }))
          .filter(item => item.rank > 0)
          .sort((left, right) => Number(right.season) - Number(left.season));

        setItems(nextItems);
        setLoading(false);
      })
      .catch(fetchError => {
        if (!active) {
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : 'Rank load failed.');
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
          title: 'Rank',
          headerStyle: {backgroundColor: AppPalette.surface},
          headerTintColor: AppPalette.text,
          headerShadowVisible: false,
        }}
      />
      <PageScroll>
        <HeroCard
          eyebrow="Player"
          title={`${nickname} rank history`}
          body="Ranked seasons are now a dedicated route instead of a footer popup."
          accentColor={accentColor}
        />
        {loading ? <StateCard title="Loading rank data" body="Fetching ranked seasons and season ship counts." /> : null}
        {error ? <StateCard tone="warning" title="Rank unavailable" body={error} /> : null}
        {!loading && !error ? (
          <Section
            title={`Seasons - ${items.length}`}
            subtitle="Ship counts show how many ranked ship stat entries exist for each season."
          >
            {items.length === 0 ? (
              <StateCard title="No ranked history" body="No ranked season data was returned for this account." />
            ) : (
              items.map(item => (
                <ListRow
                  key={item.season}
                  title={`Season ${item.season}`}
                  description={`Best rank ${item.rank} | Ships tracked ${formatNumber(item.shipCount)}`}
                  trailing={`#${item.rank}`}
                />
              ))
            )}
          </Section>
        ) : null}
      </PageScroll>
    </>
  );
}
