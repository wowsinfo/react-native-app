import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { fetchPlayerShips, getWoWsAppKeyMessage, hasWoWsAppKey } from '@/features/player/api';
import {
  calculateAverageDamage,
  calculateWinRate,
  formatNumber,
  formatPercent,
  getTopShipLists,
} from '@/features/player/format';
import { BarList, HeroCard, PageScroll, Section, StateCard } from '@/features/player/ui';
import { isGameServer } from '@/features/home/content';

const accentColor = '#8b5e1a';

export default function PlayerGraphScreen() {
  const params = useLocalSearchParams<{
    server?: string;
    accountId?: string;
    nickname?: string;
  }>();
  const server = params.server && isGameServer(params.server) ? params.server : null;
  const accountId = params.accountId ?? null;
  const nickname = params.nickname ?? 'Player';
  const [ships, setShips] = useState<Awaited<ReturnType<typeof fetchPlayerShips>>>([]);
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

        setError(fetchError instanceof Error ? fetchError.message : 'Graph load failed.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accountId, server]);

  const topLists = getTopShipLists(ships);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Graph',
          headerStyle: {backgroundColor: '#f7f1e4'},
          headerTintColor: '#1f2f25',
          headerShadowVisible: false,
        }}
      />
      <PageScroll>
        <HeroCard
          eyebrow="Player"
          title={`${nickname} graphs`}
          body="The deprecated native chart library is replaced with web-safe bar summaries."
          accentColor={accentColor}
        />
        {loading ? <StateCard title="Loading graph data" body="Computing chart-friendly lists from player ship stats." /> : null}
        {error ? <StateCard tone="warning" title="Graph unavailable" body={error} /> : null}
        {!loading && !error ? (
          <>
            <Section title="Most Played Ships" subtitle="Battle count by ship ID.">
              <BarList
                accentColor={accentColor}
                items={topLists.byBattles.map(ship => ({
                  id: String(ship.ship_id),
                  label: `Ship ${ship.ship_id}`,
                  value: ship.pvp?.battles ?? 0,
                }))}
                renderValue={value => formatNumber(value)}
              />
            </Section>
            <Section title="Damage Leaders" subtitle="Average damage per battle.">
              <BarList
                accentColor={accentColor}
                items={topLists.byDamage.map(ship => ({
                  id: String(ship.ship_id),
                  label: `Ship ${ship.ship_id}`,
                  value: calculateAverageDamage(ship.pvp),
                }))}
                renderValue={value => formatNumber(value)}
              />
            </Section>
            <Section title="Win Rate Leaders" subtitle="Minimum 20 battles.">
              <BarList
                accentColor={accentColor}
                items={topLists.byWinRate.map(ship => ({
                  id: String(ship.ship_id),
                  label: `Ship ${ship.ship_id}`,
                  value: calculateWinRate(ship.pvp),
                }))}
                renderValue={value => formatPercent(value)}
              />
            </Section>
          </>
        ) : null}
      </PageScroll>
    </>
  );
}
