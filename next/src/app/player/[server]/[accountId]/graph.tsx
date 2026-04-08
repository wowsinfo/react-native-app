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
import { useAppPreferences } from '@/features/preferences/preferences-manager';
import { isGameServer } from '@/features/home/content';

export default function PlayerGraphScreen() {
  const { palette, tintColor, t, tf } = useAppPreferences();
  const params = useLocalSearchParams<{
    server?: string;
    accountId?: string;
    nickname?: string;
  }>();
  const server = params.server && isGameServer(params.server) ? params.server : null;
  const accountId = params.accountId ?? null;
  const nickname = params.nickname ?? t('player_title');
  const [ships, setShips] = useState<Awaited<ReturnType<typeof fetchPlayerShips>>>([]);
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

        setError(fetchError instanceof Error ? fetchError.message : t('player_graph_unavailable'));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accountId, server, t]);

  const topLists = getTopShipLists(ships);

  return (
    <>
      <Stack.Screen
        options={{
          title: t('player_graph'),
          headerStyle: {backgroundColor: palette.surface},
          headerTintColor: palette.text,
          headerShadowVisible: false,
        }}
      />
      <PageScroll>
        <HeroCard
          eyebrow={t('player_title')}
          title={tf('player_graph_title_full', nickname)}
          body={t('player_graph_body_full')}
          accentColor={tintColor}
        />
        {loading ? (
          <StateCard
            title={t('player_graph_loading')}
            body={t('player_graph_loading_body')}
          />
        ) : null}
        {error ? (
          <StateCard tone="warning" title={t('player_graph_unavailable')} body={error} />
        ) : null}
        {!loading && !error ? (
          <>
            <Section
              title={t('player_graph_most_played')}
              subtitle={t('player_graph_most_played_subtitle')}
            >
              <BarList
                accentColor={tintColor}
                items={topLists.byBattles.map(ship => ({
                  id: String(ship.ship_id),
                  label: tf('player_ship_name', ship.ship_id),
                  value: ship.pvp?.battles ?? 0,
                }))}
                renderValue={value => formatNumber(value)}
              />
            </Section>
            <Section
              title={t('player_graph_damage_leaders')}
              subtitle={t('player_graph_damage_subtitle')}
            >
              <BarList
                accentColor={tintColor}
                items={topLists.byDamage.map(ship => ({
                  id: String(ship.ship_id),
                  label: tf('player_ship_name', ship.ship_id),
                  value: calculateAverageDamage(ship.pvp),
                }))}
                renderValue={value => formatNumber(value)}
              />
            </Section>
            <Section
              title={t('player_graph_win_rate_leaders')}
              subtitle={t('player_graph_win_rate_subtitle')}
            >
              <BarList
                accentColor={tintColor}
                items={topLists.byWinRate.map(ship => ({
                  id: String(ship.ship_id),
                  label: tf('player_ship_name', ship.ship_id),
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
