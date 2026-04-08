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
import { useAppPreferences } from '@/features/preferences/preferences-manager';
import { isGameServer } from '@/features/home/content';

export default function PlayerShipDetailScreen() {
  const { palette, tintColor, t, tf } = useAppPreferences();
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

        setError(
          fetchError instanceof Error ? fetchError.message : t('player_ship_detail_unavailable'),
        );
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accountId, server, shipId, t]);

  const pvp = ship?.pvp;

  return (
    <>
      <Stack.Screen
        options={{
          title: shipId ? tf('player_ship_name', shipId) : t('player_ship_detail_title'),
          headerStyle: {backgroundColor: palette.surface},
          headerTintColor: palette.text,
          headerShadowVisible: false,
        }}
      />
      <PageScroll>
        <HeroCard
          eyebrow={t('player_ships')}
          title={tf('player_ship_name', shipId ?? t('common_unknown'))}
          body={t('player_ship_detail_body')}
          accentColor={tintColor}
        />
        {loading ? (
          <StateCard
            title={t('player_ship_detail_loading')}
            body={t('player_ship_detail_loading_body')}
          />
        ) : null}
        {error ? (
          <StateCard
            tone="warning"
            title={t('player_ship_detail_unavailable')}
            body={error}
          />
        ) : null}
        {ship ? (
          <Section
            title={t('player_ship_detail_performance')}
            subtitle={t('player_ship_detail_performance_subtitle')}
          >
            <MetricGrid>
              <MetricTile label={t('player_battles')} value={formatNumber(pvp?.battles)} />
              <MetricTile label={t('player_win_rate')} value={formatPercent(calculateWinRate(pvp))} />
              <MetricTile label={t('player_avg_damage')} value={formatNumber(calculateAverageDamage(pvp))} />
              <MetricTile label={t('player_avg_frags')} value={calculateAverageFrags(pvp).toFixed(2)} />
              <MetricTile label={t('player_max_damage')} value={formatNumber(pvp?.max_damage_dealt)} />
              <MetricTile label={t('player_max_xp')} value={formatNumber(pvp?.max_xp)} />
              <MetricTile label={t('player_max_frags')} value={formatNumber(pvp?.max_frags_battle)} />
              <MetricTile label={t('player_last_battle')} value={formatDateTime(ship.last_battle_time)} />
            </MetricGrid>
          </Section>
        ) : null}
      </PageScroll>
    </>
  );
}
