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
import { getServerLabel, isGameServer } from '@/features/home/content';
import { openUrl } from '@/lib/platform-actions';

const accentColor = '#8b5e1a';

export default function ClanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{server?: string; clanId?: string}>();
  const server = params.server && isGameServer(params.server) ? params.server : null;
  const clanId = params.clanId ?? null;
  const [clan, setClan] = useState<ClanInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!server || !clanId) {
      setError('Invalid clan route.');
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

        setError(fetchError instanceof Error ? fetchError.message : 'Clan load failed.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [clanId, server]);

  const members = clan?.members
    ? Object.values(clan.members).sort((left, right) => left.joined_at - right.joined_at)
    : [];

  return (
    <>
      <Stack.Screen
        options={{
          title: clan?.tag ?? 'Clan',
          headerStyle: {backgroundColor: '#f7f1e4'},
          headerTintColor: '#1f2f25',
          headerShadowVisible: false,
        }}
      />
      <PageScroll>
        <HeroCard
          eyebrow="Clan"
          title={clan?.tag ?? 'Clan'}
          body={
            clan?.name
              ? `${clan.name} · ${server ? getServerLabel(server) : 'Server'}`
              : 'Clan roster and member links'
          }
          accentColor={accentColor}
        />
        {loading ? <StateCard title="Loading clan" body="Fetching clan metadata and member roster." /> : null}
        {error ? <StateCard tone="warning" title="Clan unavailable" body={error} /> : null}
        {clan ? (
          <>
            <Section title="Overview" subtitle="Clan metadata now lives in its own Expo route.">
              <MetricGrid>
                <MetricTile label="Members" value={String(clan.members_count ?? 0)} />
                <MetricTile label="Created" value={formatDateTime(clan.created_at)} />
                <MetricTile label="Creator" value={clan.creator_name ?? 'Unknown'} />
                <MetricTile label="Leader" value={clan.leader_name ?? 'Unknown'} />
              </MetricGrid>
              {server && clanId ? (
                <ListRow
                  title="WoWs Numbers"
                  description="Open the external clan profile."
                  trailing="Open"
                  onPress={() => void openUrl(getClanExternalUrl(server, clanId, clan.tag))}
                />
              ) : null}
              {clan.description ? (
                <ListRow title="Description" description={clan.description} />
              ) : null}
            </Section>

            <Section
              title={`Members - ${members.length}`}
              subtitle="Selecting a member jumps into the new player overview route."
            >
              {members.map(member => (
                <ListRow
                  key={member.account_id}
                  title={member.account_name}
                  description={`Joined ${formatDateTime(member.joined_at)}`}
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
