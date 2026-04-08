import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  fetchClanInfo,
  getClanExternalUrl,
  getWoWsAppKeyMessage,
  hasWoWsAppKey,
  type ClanInfo,
} from '@/features/player/api';
import { formatDateTime } from '@/features/player/format';
import { getPlayerRoute } from '@/features/player/routes';
import {
  HeroCard,
  ListRow,
  MetricGrid,
  MetricTile,
  PageScroll,
  Section,
  StateCard,
} from '@/features/player/ui';
import { useAppPreferences } from '@/features/preferences/preferences-manager';
import { getServerLabel, isGameServer } from '@/features/home/content';
import { openUrl } from '@/lib/platform-actions';

export default function ClanScreen() {
  const router = useRouter();
  const { palette, tintColor, t } = useAppPreferences();
  const params = useLocalSearchParams<{server?: string; clanId?: string}>();
  const server = params.server && isGameServer(params.server) ? params.server : null;
  const clanId = params.clanId ?? null;
  const [clan, setClan] = useState<ClanInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!server || !clanId) {
      setError(t('clan_route_invalid'));
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

    void fetchClanInfo(server, clanId)
      .then(result => {
        if (!active) {
          return;
        }

        setClan(result);
        setLoading(false);
      })
      .catch(fetchError => {
        if (!active) {
          return;
        }

        setError(fetchError instanceof Error ? fetchError.message : t('clan_load_failed'));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [clanId, server, t]);

  const members = clan?.members
    ? Object.values(clan.members).sort((left, right) => left.joined_at - right.joined_at)
    : [];

  return (
    <>
      <Stack.Screen
        options={{
          title: clan?.tag ?? t('player_clan'),
          headerStyle: {backgroundColor: palette.surface},
          headerTintColor: palette.text,
          headerShadowVisible: false,
        }}
      />
      <PageScroll>
        <HeroCard
          eyebrow={t('player_clan')}
          title={clan?.tag ?? t('player_clan')}
          body={
            clan?.name
              ? `${clan.name} - ${server ? getServerLabel(server, t) : t('common_server')}`
              : t('clan_roster_body')
          }
          accentColor={tintColor}
        />
        {loading ? (
          <StateCard title={t('clan_loading')} body={t('clan_loading_body')} />
        ) : null}
        {error ? (
          <StateCard tone="warning" title={t('clan_unavailable')} body={error} />
        ) : null}
        {clan ? (
          <>
            <Section title={t('clan_overview')} subtitle={t('clan_overview_subtitle')}>
              <MetricGrid>
                <MetricTile label={t('clan_members_title')} value={String(clan.members_count ?? 0)} />
                <MetricTile label={t('clan_created')} value={formatDateTime(clan.created_at)} />
                <MetricTile label={t('clan_creator')} value={clan.creator_name ?? t('common_unknown')} />
                <MetricTile label={t('clan_leader')} value={clan.leader_name ?? t('common_unknown')} />
              </MetricGrid>
              {server && clanId ? (
                <ListRow
                  title={t('player_wows_numbers')}
                  description={t('clan_external_desc')}
                  trailing={t('common_open')}
                  onPress={() => void openUrl(getClanExternalUrl(server, clanId, clan.tag))}
                />
              ) : null}
              {clan.description ? (
                <ListRow title={t('common_description')} description={clan.description} />
              ) : null}
            </Section>

            <Section
              title={`${t('clan_members_title')} - ${members.length}`}
              subtitle={t('clan_members_subtitle')}
            >
              {members.map(member => (
                <ListRow
                  key={member.account_id}
                  title={member.account_name}
                  description={`${t('clan_joined')} ${formatDateTime(member.joined_at)}`}
                  trailing={String(member.account_id)}
                  onPress={() =>
                    server
                      ? router.push(getPlayerRoute(server, member.account_id, member.account_name))
                      : undefined
                  }
                />
              ))}
            </Section>
          </>
        ) : null}
      </PageScroll>
    </>
  );
}
