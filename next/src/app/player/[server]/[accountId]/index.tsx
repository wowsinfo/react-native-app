import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
  getDetailedSections,
  getRecordItems,
  getWeaponRecordItems,
} from '@/features/player/overview';
import {
  ListSectionBlock,
  MetricSectionBlock,
} from '@/features/player/overview-ui';
import {
  calculateOverallRating,
  getRatingColor,
  getRatingLabelKey,
} from '@/features/player/rating';
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
  const styles = createStyles(palette);
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
  const ratingSummary = data ? calculateOverallRating(data.ships) : {rating: null, ratedShipCount: 0};
  const ratingColor = getRatingColor(ratingSummary.rating);
  const detailedSections = getDetailedSections(pvp, t);
  const recordItems = getRecordItems(pvp, t);
  const weaponRecordItems = getWeaponRecordItems(pvp, t);

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
        >
          {ratingSummary.rating ? (
            <View style={styles.ratingCardWrap}>
              <View style={[styles.ratingBadge, { backgroundColor: ratingColor }]}>
                <Text style={styles.ratingBadgeLabel}>{t('player_personal_rating')}</Text>
                <Text style={styles.ratingBadgeValue}>{formatNumber(ratingSummary.rating)}</Text>
                <Text style={styles.ratingBadgeTier}>{t(getRatingLabelKey(ratingSummary.rating))}</Text>
              </View>
              <View style={styles.ratingMeta}>
                <Text style={styles.ratingMetaTitle}>{t('player_rating_description')}</Text>
                <Text style={styles.ratingMetaBody}>
                  {t('player_rating_battles')}: {formatNumber(ratingSummary.ratedShipCount)}
                </Text>
              </View>
            </View>
          ) : null}
        </HeroCard>

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
                {ratingSummary.rating ? (
                  <MetricTile
                    label={t('player_rating_score')}
                    value={formatNumber(ratingSummary.rating)}
                  />
                ) : null}
              </MetricGrid>
            </Section>

            {data.hidden ? (
              <StateCard
                tone="warning"
                title={t('player_hidden_title')}
                body={t('player_hidden_body')}
              />
            ) : null}

            {!data.hidden && detailedSections.length > 0 ? (
              <MetricSectionBlock
                title={t('player_detailed_title')}
                subtitle={t('player_detailed_subtitle')}
                sections={detailedSections}
              />
            ) : null}

            {!data.hidden && (recordItems.length > 0 || weaponRecordItems.length > 0) ? (
              <ListSectionBlock
                title={t('player_records_title')}
                subtitle={t('player_records_subtitle')}
                items={[...recordItems, ...weaponRecordItems]}
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
                  iconName="AchievementTab"
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
                  iconName="Ship"
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
                  iconName="Rank"
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
                  iconName="Graph"
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

function createStyles(
  palette: ReturnType<typeof useAppPreferences>['palette'],
) {
  return StyleSheet.create({
    ratingCardWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 10,
      alignItems: 'stretch',
    },
    ratingBadge: {
      minWidth: 170,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 2,
    },
    ratingBadgeLabel: {
      color: palette.inverseText,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    ratingBadgeValue: {
      color: palette.inverseText,
      fontSize: 28,
      fontWeight: '800',
    },
    ratingBadgeTier: {
      color: palette.inverseText,
      fontSize: 13,
      fontWeight: '700',
    },
    ratingMeta: {
      flex: 1,
      minWidth: 200,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.surfaceAlt,
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 4,
    },
    ratingMetaTitle: {
      color: palette.text,
      fontSize: 14,
      fontWeight: '700',
      lineHeight: 20,
    },
    ratingMetaBody: {
      color: palette.muted,
      fontSize: 13,
      lineHeight: 18,
    },
  });
}
