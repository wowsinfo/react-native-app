import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  fetchPlayerHub,
  getPlayerExternalUrl,
  getWoWsAppKeyMessage,
  hasWoWsAppKey,
  type PlayerHubData,
} from '@/features/player/api';
import {
  calculateAverageDamage,
  calculateAverageFrags,
  calculateWinRate,
  formatDateTime,
  formatNumber,
  formatPercent,
  getLatestRank,
} from '@/features/player/format';
import {
  getClanRoute,
  getPlayerAchievementsRoute,
  getPlayerGraphRoute,
  getPlayerRankRoute,
  getPlayerShipsRoute,
} from '@/features/player/routes';
import {
  ActionTile,
  HeroCard,
  InlineGroup,
  MetricGrid,
  MetricTile,
  PageScroll,
  Section,
  StateCard,
} from '@/features/player/ui';
import { useAppPreferences } from '@/features/preferences/preferences-manager';
import { getServerLabel, isGameServer } from '@/features/home/content';
import { openUrl } from '@/lib/platform-actions';

export default function PlayerOverviewScreen() {
  const router = useRouter();
  const { palette, tintColor, t, tf } = useAppPreferences();
  const params = useLocalSearchParams<{
    server?: string;
    accountId?: string;
    nickname?: string;
  }>();
  const server = params.server && isGameServer(params.server) ? params.server : null;
  const accountId = params.accountId ?? null;
  const fallbackNickname = params.nickname ?? t('player_title');
  const [data, setData] = useState<PlayerHubData | null>(null);
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

    setLoading(true);
    setError(null);

    void fetchPlayerHub(server, accountId)
      .then(result => {
        if (!active) {
          return;
        }

        setData(result);
        setLoading(false);
      })
      .catch(fetchError => {
        if (!active) {
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : t('player_load_failed'));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accountId, server, t]);

  const latestRank = data ? getLatestRank(data.rank) : null;
  const basic = data?.basic ?? null;
  const pvp = basic?.statistics?.pvp;
  const nickname = basic?.nickname ?? fallbackNickname;

  return (
    <>
      <Stack.Screen
        options={{
          title: nickname,
          headerStyle: {
            backgroundColor: palette.surface,
          },
          headerTintColor: palette.text,
          headerShadowVisible: false,
        }}
      />
      <PageScroll>
        <HeroCard
          eyebrow={t('player_title')}
          title={nickname}
          body={
            server && accountId
              ? tf('player_server_account', getServerLabel(server, t), accountId)
              : t('player_route_fallback')
          }
          accentColor={tintColor}
        />

        {loading ? (
          <StateCard
            title={t('player_loading')}
            body={t('player_loading_body')}
          />
        ) : null}

        {error ? (
          <StateCard tone="warning" title={t('player_unavailable_title')} body={error} />
        ) : null}

        {data && basic ? (
          <>
            <Section
              title={t('player_profile_title')}
              subtitle={t('player_profile_subtitle')}
            >
              <MetricGrid>
                <MetricTile label={t('player_battles')} value={formatNumber(pvp?.battles)} />
                <MetricTile label={t('player_win_rate')} value={formatPercent(calculateWinRate(pvp))} />
                <MetricTile
                  label={t('player_avg_damage')}
                  value={formatNumber(calculateAverageDamage(pvp))}
                />
                <MetricTile
                  label={t('player_avg_frags')}
                  value={calculateAverageFrags(pvp).toFixed(2)}
                />
                <MetricTile label={t('player_level')} value={String(basic.leveling_tier ?? 0)} />
                <MetricTile
                  label={t('player_current_rank')}
                  value={
                    latestRank
                      ? tf('player_season_rank', latestRank.season, latestRank.rank)
                      : t('common_none')
                  }
                />
              </MetricGrid>
              <MetricGrid>
                <MetricTile label={t('player_registered')} value={formatDateTime(basic.created_at)} />
                <MetricTile
                  label={t('player_last_battle')}
                  value={formatDateTime(basic.last_battle_time)}
                />
                <MetricTile
                  label={t('player_clan')}
                  value={data.clanTag ? `[${data.clanTag}]` : t('player_no_clan')}
                />
                <MetricTile label={t('player_ships_count')} value={formatNumber(data.ships.length)} />
              </MetricGrid>
            </Section>

            {data.hidden ? (
              <StateCard
                tone="warning"
              title={t('player_hidden_title')}
              body={t('player_hidden_body')}
            />
          ) : null}

            <Section
              title={t('player_pages_title')}
              subtitle={t('player_pages_subtitle')}
            >
              <InlineGroup style={{padding: 18}}>
                <ActionTile
                  title={t('player_achievements')}
                  body={t('player_achievements_body')}
                  accentColor={tintColor}
                  onPress={() =>
                    server && accountId
                      ? router.push(getPlayerAchievementsRoute(server, accountId, nickname))
                      : undefined
                  }
                />
                <ActionTile
                  title={t('player_ships')}
                  body={t('player_ships_body')}
                  accentColor={tintColor}
                  onPress={() =>
                    server && accountId
                      ? router.push(getPlayerShipsRoute(server, accountId, nickname))
                      : undefined
                  }
                />
                <ActionTile
                  title={t('player_rank')}
                  body={t('player_rank_body')}
                  accentColor={tintColor}
                  onPress={() =>
                    server && accountId
                      ? router.push(getPlayerRankRoute(server, accountId, nickname))
                      : undefined
                  }
                />
                <ActionTile
                  title={t('player_graph')}
                  body={t('player_graph_body')}
                  accentColor={tintColor}
                  onPress={() =>
                    server && accountId
                      ? router.push(getPlayerGraphRoute(server, accountId, nickname))
                      : undefined
                  }
                />
                {data.clanId ? (
                  <ActionTile
                    title={t('player_clan')}
                    body={`${t('player_clan_open')} ${data.clanTag || ''}`.trim()}
                    accentColor={tintColor}
                    onPress={() =>
                      server && data.clanId
                        ? router.push(getClanRoute(server, data.clanId))
                        : undefined
                    }
                  />
                ) : null}
                <ActionTile
                  title={t('player_wows_numbers')}
                  body={t('player_external_body')}
                  accentColor={tintColor}
                  onPress={() =>
                    server && accountId
                      ? void openUrl(getPlayerExternalUrl(server, accountId, nickname))
                      : undefined
                  }
                />
              </InlineGroup>
            </Section>
          </>
        ) : null}
      </PageScroll>
    </>
  );
}
