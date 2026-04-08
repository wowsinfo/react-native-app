import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { fetchPlayerRank, getWoWsAppKeyMessage, hasWoWsAppKey } from '@/features/player/api';
import { formatNumber } from '@/features/player/format';
import { HeroCard, ListRow, PageScroll, Section, StateCard } from '@/features/player/ui';
import { useAppPreferences } from '@/features/preferences/preferences-manager';
import { isGameServer } from '@/features/home/content';

export default function PlayerRankScreen() {
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

        setError(fetchError instanceof Error ? fetchError.message : t('player_rank_unavailable'));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accountId, server, t]);

  return (
    <>
      <Stack.Screen
        options={{
          title: t('player_rank'),
          headerStyle: {backgroundColor: palette.surface},
          headerTintColor: palette.text,
          headerShadowVisible: false,
        }}
      />
      <PageScroll>
        <HeroCard
          eyebrow={t('player_title')}
          title={tf('player_rank_title_full', nickname)}
          body={t('player_rank_body_full')}
          accentColor={tintColor}
        />
        {loading ? (
          <StateCard
            title={t('player_rank_loading')}
            body={t('player_rank_loading_body')}
          />
        ) : null}
        {error ? (
          <StateCard tone="warning" title={t('player_rank_unavailable')} body={error} />
        ) : null}
        {!loading && !error ? (
          <Section
            title={tf('player_rank_seasons_title', items.length)}
            subtitle={t('player_rank_seasons_subtitle')}
          >
            {items.length === 0 ? (
              <StateCard
                title={t('player_rank_empty_title')}
                body={t('player_rank_empty_body')}
              />
            ) : (
              items.map(item => (
                <ListRow
                  key={item.season}
                  title={`${t('player_rank_season')} ${item.season}`}
                  description={`${t('player_rank_best_rank')} ${item.rank} | ${t('player_rank_ships_tracked')} ${formatNumber(item.shipCount)}`}
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
