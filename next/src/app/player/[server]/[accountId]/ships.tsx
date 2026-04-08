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
import { AppPalette } from '@/constants/theme';
import { isGameServer } from '@/features/home/content';

const accentColor = AppPalette.accent;
const shipSortOptions = [
  {value: 'lastBattle', label: 'Last Battle'},
  {value: 'battles', label: 'Battles'},
  {value: 'damage', label: 'Avg Damage'},
  {value: 'winRate', label: 'Win Rate'},
] as const;

export default function PlayerShipsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    server?: string;
    accountId?: string;
    nickname?: string;
  }>();
  const server = params.server && isGameServer(params.server) ? params.server : null;
  const accountId = params.accountId ?? null;
  const nickname = params.nickname ?? 'Player';
  const [ships, setShips] = useState<Awaited<ReturnType<typeof fetchPlayerShips>>>([]);
  const [sortMode, setSortMode] = useState<(typeof shipSortOptions)[number]['value']>('lastBattle');
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

        setError(fetchError instanceof Error ? fetchError.message : 'Ship load failed.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accountId, server]);

  const sortedShips = sortShips(ships, sortMode);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Ships',
          headerStyle: {backgroundColor: AppPalette.surface},
          headerTintColor: AppPalette.text,
          headerShadowVisible: false,
        }}
      />
      <PageScroll>
        <HeroCard
          eyebrow="Player"
          title={`${nickname} ships`}
          body="The old ship grid is now a sortable route that can drill into one ship at a time."
          accentColor={accentColor}
        />
        {loading ? <StateCard title="Loading ships" body="Fetching player ship stats." /> : null}
        {error ? <StateCard tone="warning" title="Ships unavailable" body={error} /> : null}
        {!loading && !error ? (
          <>
            <Section
              title="Sort"
              subtitle="The sort controls mirror the old footer actions."
            >
              <Section title="Mode" subtitle="Choose the primary ordering for the list.">
                <ChipRow
                  value={sortMode}
                  options={shipSortOptions.map(option => ({...option}))}
                  onChange={setSortMode}
                  accentColor={accentColor}
                />
              </Section>
            </Section>
            <Section
              title={`Ships - ${sortedShips.length}`}
              subtitle="Names and encyclopedia images can be layered back in later without changing the route structure."
            >
              {sortedShips.length === 0 ? (
                <StateCard title="No ship stats" body="No per-ship battle data was returned for this account." />
              ) : (
                sortedShips.map(ship => (
                  <ListRow
                    key={ship.ship_id}
                    title={`Ship ${ship.ship_id}`}
                    description={`Battles ${formatNumber(ship.pvp?.battles)} | WR ${formatPercent(
                      calculateWinRate(ship.pvp),
                    )} | Avg DMG ${formatNumber(calculateAverageDamage(ship.pvp))} | Last battle ${formatDateTime(
                      ship.last_battle_time,
                    )}`}
                    trailing="Detail"
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
