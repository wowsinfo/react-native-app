import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { fetchPlayerShips, getWoWsAppKeyMessage, hasWoWsAppKey } from '@/features/player/api';
import {
  calculateAverageDamage,
  calculateWinRate,
  formatDateTime,
  formatNumber,
  formatPercent,
  sortShips,
} from '@/features/player/format';
import { getPlayerShipDetailRoute } from '@/features/player/routes';
import {
  ChipRow,
  HeroCard,
  ListRow,
  PageScroll,
  Section,
  StateCard,
} from '@/features/player/ui';
import { useAppPreferences } from '@/features/preferences/preferences-manager';
import { createStackScreenOptions } from '@/features/preferences/theme';
import { isGameServer } from '@/features/home/content';

export default function PlayerShipsScreen() {
  const router = useRouter();
  const { palette, tintColor, t, tf } = useAppPreferences();
  const params = useLocalSearchParams<{
    server?: string;
    accountId?: string;
    nickname?: string;
  }>();
  const server = params.server && isGameServer(params.server) ? params.server : null;
  const accountId = params.accountId ?? null;
  const nickname = params.nickname ?? t('player_title');
  const shipSortOptions = [
    {value: 'lastBattle', label: t('player_ships_sort_last_battle')},
    {value: 'battles', label: t('player_ships_sort_battles')},
    {value: 'damage', label: t('player_ships_sort_damage')},
    {value: 'winRate', label: t('player_ships_sort_win_rate')},
  ] as const;
  const [ships, setShips] = useState<Awaited<ReturnType<typeof fetchPlayerShips>>>([]);
  const [sortMode, setSortMode] = useState<(typeof shipSortOptions)[number]['value']>('lastBattle');
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

    void fetchPlayerShips(server, accountId)
      .then(result => {
        if (!active) {
          return;
        }

        setShips(result);
        setLoading(false);
      })
      .catch(fetchError => {
        if (!active) {
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : t('player_ships_unavailable'));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accountId, server, t]);

  const sortedShips = sortShips(ships, sortMode);

  return (
    <>
      <Stack.Screen
        options={createStackScreenOptions(palette, {
          title: t('player_ships'),
        })}
      />
      <PageScroll>
        <HeroCard
          eyebrow={t('player_title')}
          title={tf('player_ships_title_full', nickname)}
          body={t('player_ships_body_full')}
          accentColor={tintColor}
        />
        {loading ? (
          <StateCard
            title={t('player_ships_loading')}
            body={t('player_ships_loading_body')}
          />
        ) : null}
        {error ? (
          <StateCard tone="warning" title={t('player_ships_unavailable')} body={error} />
        ) : null}
        {!loading && !error ? (
          <>
            <Section
              title={t('player_ships_sort_title')}
              subtitle={t('player_ships_sort_subtitle')}
            >
              <Section
                title={t('player_ships_mode_title')}
                subtitle={t('player_ships_mode_subtitle')}
              >
                <ChipRow
                  value={sortMode}
                  options={shipSortOptions.map(option => ({...option}))}
                  onChange={setSortMode}
                  accentColor={tintColor}
                />
              </Section>
            </Section>
            <Section
              title={tf('player_ships_section_title', sortedShips.length)}
              subtitle={t('player_ships_section_subtitle')}
            >
              {sortedShips.length === 0 ? (
                <StateCard
                  title={t('player_ships_empty_title')}
                  body={t('player_ships_empty_body')}
                />
              ) : (
                sortedShips.map(ship => (
                  <ListRow
                    key={ship.ship_id}
                    title={tf('player_ship_name', ship.ship_id)}
                    description={`${t('player_battles')} ${formatNumber(ship.pvp?.battles)} | ${t('player_win_rate')} ${formatPercent(
                      calculateWinRate(ship.pvp),
                    )} | ${t('player_avg_damage')} ${formatNumber(calculateAverageDamage(ship.pvp))} | ${t('player_last_battle')} ${formatDateTime(
                      ship.last_battle_time,
                    )}`}
                    trailing={t('player_detail_label')}
                    onPress={() =>
                      server && accountId
                        ? router.push(getPlayerShipDetailRoute(server, accountId, ship.ship_id))
                        : undefined
                    }
                  />
                ))
              )}
            </Section>
          </>
        ) : null}
      </PageScroll>
    </>
  );
}
