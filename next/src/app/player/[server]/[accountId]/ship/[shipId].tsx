import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  fetchPlayerShipDetail,
  getWoWsAppKeyMessage,
  hasWoWsAppKey,
} from '@/features/player/api';
import {
  formatDateTime,
  formatNumber,
} from '@/features/player/format';
import {
  getClassicSummaryItems,
  getDetailedSections,
  getShipRecordSections,
  getWeaponRecordItems,
} from '@/features/player/overview';
import {
  ListSectionBlock,
  MetricSectionBlock,
} from '@/features/player/overview-ui';
import {
  ClassicSummaryStrip,
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
  const classicSummaryItems = getClassicSummaryItems(pvp, t);
  const detailedSections = getDetailedSections(pvp, t);
  const shipRecordSections = getShipRecordSections(pvp, t);
  const weaponRecordItems = getWeaponRecordItems(pvp, t);

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
          <>
            <Section
              title={t('player_ship_detail_performance')}
              subtitle={t('player_ship_detail_performance_subtitle')}
            >
              <ClassicSummaryStrip items={classicSummaryItems} accentColor={tintColor} />
              <MetricGrid>
                <MetricTile label={t('player_battles')} value={formatNumber(pvp?.battles)} />
                <MetricTile label={t('player_win_rate')} value={classicSummaryItems[1]?.value ?? '0%'} />
                <MetricTile label={t('player_avg_damage')} value={classicSummaryItems[2]?.value ?? '0'} />
                <MetricTile label={t('player_last_battle')} value={formatDateTime(ship.last_battle_time)} />
              </MetricGrid>
            </Section>
            <MetricSectionBlock
              title={t('player_ship_detail_detailed_title')}
              subtitle={t('player_ship_detail_detailed_subtitle')}
              sections={detailedSections}
            />
            <MetricSectionBlock
              title={t('player_ship_detail_records_title')}
              subtitle={t('player_ship_detail_records_subtitle')}
              sections={shipRecordSections}
            />
            <ListSectionBlock
              title={t('player_records_title')}
              subtitle={t('player_ship_detail_records_subtitle')}
              items={weaponRecordItems}
            />
          </>
        ) : null}
      </PageScroll>
    </>
  );
}
