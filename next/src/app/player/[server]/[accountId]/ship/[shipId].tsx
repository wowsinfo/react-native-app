import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  fetchPlayerShipDetail,
  getWoWsAppKeyMessage,
  hasWoWsAppKey,
} from '@/features/player/api';
import {
  calculateAverageDamage,
  calculateAverageFrags,
  calculateWinRate,
  formatDateTime,
  formatNumber,
  formatPercent,
} from '@/features/player/format';
import {
  HeroCard,
  MetricGrid,
  MetricTile,
  PageScroll,
  Section,
  StateCard,
} from '@/features/player/ui';
import { isGameServer } from '@/features/home/content';

const accentColor = '#8b5e1a';

export default function PlayerShipDetailScreen() {
  const params = useLocalSearchParams<{server?: string; accountId?: string; shipId?: string}>();
  const server = params.server && isGameServer(params.server) ? params.server : null;
  const accountId = params.accountId ?? null;
  const shipId = params.shipId ?? null;
  const [ship, setShip] = useState<Awaited<ReturnType<typeof fetchPlayerShipDetail>>>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!server || !accountId || !shipId) {
      setError('Invalid ship route.');
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

    void fetchPlayerShipDetail(server, accountId, shipId)
      .then(result => {
        if (!active) {
          return;
        }

        setShip(result);
        setLoading(false);
      })
      .catch(fetchError => {
        if (!active) {
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : 'Ship detail load failed.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accountId, server, shipId]);

  const pvp = ship?.pvp;

  return (
    <>
      <Stack.Screen
        options={{
          title: shipId ? `Ship ${shipId}` : 'Ship',
          headerStyle: {backgroundColor: '#f7f1e4'},
          headerTintColor: '#1f2f25',
          headerShadowVisible: false,
        }}
      />
      <PageScroll>
        <HeroCard
          eyebrow="Ship Detail"
          title={`Ship ${shipId ?? 'Unknown'}`}
          body="This replaces the old player ship detail screen without requiring cached wiki metadata."
          accentColor={accentColor}
        />
        {loading ? <StateCard title="Loading ship detail" body="Fetching one ship stat line for this player." /> : null}
        {error ? <StateCard tone="warning" title="Ship detail unavailable" body={error} /> : null}
        {ship ? (
          <Section title="Performance" subtitle="Raw ship performance for this player account.">
            <MetricGrid>
              <MetricTile label="Battles" value={formatNumber(pvp?.battles)} />
              <MetricTile label="Win Rate" value={formatPercent(calculateWinRate(pvp))} />
              <MetricTile label="Avg Damage" value={formatNumber(calculateAverageDamage(pvp))} />
              <MetricTile label="Avg Frags" value={calculateAverageFrags(pvp).toFixed(2)} />
              <MetricTile label="Max Damage" value={formatNumber(pvp?.max_damage_dealt)} />
              <MetricTile label="Max XP" value={formatNumber(pvp?.max_xp)} />
              <MetricTile label="Max Frags" value={formatNumber(pvp?.max_frags_battle)} />
              <MetricTile label="Last Battle" value={formatDateTime(ship.last_battle_time)} />
            </MetricGrid>
          </Section>
        ) : null}
      </PageScroll>
    </>
  );
}
