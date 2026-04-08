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
import { AppPalette } from '@/constants/theme';
import { getServerLabel, isGameServer } from '@/features/home/content';
import { openUrl } from '@/lib/platform-actions';

const accentColor = AppPalette.accent;

export default function PlayerOverviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    server?: string;
    accountId?: string;
    nickname?: string;
  }>();
  const server = params.server && isGameServer(params.server) ? params.server : null;
  const accountId = params.accountId ?? null;
  const fallbackNickname = params.nickname ?? 'Player';
  const [data, setData] = useState<PlayerHubData | null>(null);
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

        setError(fetchError instanceof Error ? fetchError.message : 'Player load failed.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accountId, server]);

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
            backgroundColor: AppPalette.surface,
          },
          headerTintColor: AppPalette.text,
          headerShadowVisible: false,
        }}
      />
      <PageScroll>
        <HeroCard
          eyebrow="Player"
          title={nickname}
          body={
            server && accountId
              ? `${getServerLabel(server)} account ${accountId}`
              : 'Player route'
          }
          accentColor={accentColor}
        />

        {loading ? (
          <StateCard
            title="Loading player"
            body="Fetching the same account, ship, achievement, clan, and rank data that powered the legacy statistics screen."
          />
        ) : null}

        {error ? <StateCard tone="warning" title="Player unavailable" body={error} /> : null}

        {data && basic ? (
          <>
            <Section
              title="Profile"
              subtitle="This is the new Expo home for the old statistics overview."
            >
              <MetricGrid>
                <MetricTile label="Battles" value={formatNumber(pvp?.battles)} />
                <MetricTile label="Win Rate" value={formatPercent(calculateWinRate(pvp))} />
                <MetricTile
                  label="Avg Damage"
                  value={formatNumber(calculateAverageDamage(pvp))}
                />
                <MetricTile
                  label="Avg Frags"
                  value={calculateAverageFrags(pvp).toFixed(2)}
                />
                <MetricTile label="Level" value={String(basic.leveling_tier ?? 0)} />
                <MetricTile
                  label="Current Rank"
                  value={latestRank ? `S${latestRank.season} #${latestRank.rank}` : 'None'}
                />
              </MetricGrid>
              <MetricGrid>
                <MetricTile label="Registered" value={formatDateTime(basic.created_at)} />
                <MetricTile
                  label="Last Battle"
                  value={formatDateTime(basic.last_battle_time)}
                />
                <MetricTile
                  label="Clan"
                  value={data.clanTag ? `[${data.clanTag}]` : 'No clan'}
                />
                <MetricTile label="Ships" value={formatNumber(data.ships.length)} />
              </MetricGrid>
            </Section>

            {data.hidden ? (
              <StateCard
                tone="warning"
                title="Hidden or empty profile"
                body="The account appears hidden, or it does not expose battle data. The route is still valid, but some subpages may remain sparse."
              />
            ) : null}

            <Section
              title="Player Pages"
              subtitle="The legacy footer tabs are now explicit Expo routes."
            >
              <InlineGroup style={{padding: 18}}>
                <ActionTile
                  title="Achievements"
                  body="Browse the account's earned achievements and counts."
                  accentColor={accentColor}
                  onPress={() =>
                    server && accountId
                      ? router.push(getPlayerAchievementsRoute(server, accountId, nickname))
                      : undefined
                  }
                />
                <ActionTile
                  title="Ships"
                  body="Inspect ship-by-ship performance and drill into a ship detail page."
                  accentColor={accentColor}
                  onPress={() =>
                    server && accountId
                      ? router.push(getPlayerShipsRoute(server, accountId, nickname))
                      : undefined
                  }
                />
                <ActionTile
                  title="Rank"
                  body="Review ranked seasons and linked season ship counts."
                  accentColor={accentColor}
                  onPress={() =>
                    server && accountId
                      ? router.push(getPlayerRankRoute(server, accountId, nickname))
                      : undefined
                  }
                />
                <ActionTile
                  title="Graph"
                  body="See chart-style summaries without the deprecated native chart library."
                  accentColor={accentColor}
                  onPress={() =>
                    server && accountId
                      ? router.push(getPlayerGraphRoute(server, accountId, nickname))
                      : undefined
                  }
                />
                {data.clanId ? (
                  <ActionTile
                    title="Clan"
                    body={`Open ${data.clanTag || 'the clan'} roster and member links.`}
                    accentColor={accentColor}
                    onPress={() =>
                      server && data.clanId
                        ? router.push(getClanRoute(server, data.clanId))
                        : undefined
                    }
                  />
                ) : null}
                <ActionTile
                  title="WoWs Numbers"
                  body="Open the external stats profile for comparison."
                  accentColor={accentColor}
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
