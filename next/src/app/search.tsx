import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  fetchPlayersOnline,
  getWoWsAppKeyMessage,
  hasWoWsAppKey,
  searchClans,
  searchPlayers,
  type SearchClan,
  type SearchPlayer,
} from '@/features/player/api';
import { getClanRoute, getPlayerRoute } from '@/features/player/routes';
import {
  ChipRow,
  HeroCard,
  ListRow,
  PageScroll,
  Section,
  StateCard,
} from '@/features/player/ui';
import { getServerLabel, serverOptions, type GameServer } from '@/features/home/content';

const accentColor = '#8b5e1a';

export default function SearchScreen() {
  const router = useRouter();
  const [server, setServer] = useState<GameServer>('asia');
  const [query, setQuery] = useState('');
  const [online, setOnline] = useState<number | null>(null);
  const [players, setPlayers] = useState<SearchPlayer[]>([]);
  const [clans, setClans] = useState<SearchClan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!hasWoWsAppKey()) {
      setOnline(null);
      return () => {
        active = false;
      };
    }

    void fetchPlayersOnline(server)
      .then(value => {
        if (active) {
          setOnline(value);
        }
      })
      .catch(() => {
        if (active) {
          setOnline(null);
        }
      });

    return () => {
      active = false;
    };
  }, [server]);

  useEffect(() => {
    let active = true;

    if (!hasWoWsAppKey()) {
      setError(getWoWsAppKeyMessage());
      setPlayers([]);
      setClans([]);
      return () => {
        active = false;
      };
    }

    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setPlayers([]);
      setClans([]);
      setLoading(false);
      setError(null);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    setError(null);

    const timeout = setTimeout(() => {
      Promise.all([
        trimmed.length > 2 ? searchPlayers(server, trimmed) : Promise.resolve([]),
        trimmed.length > 1 && trimmed.length < 6
          ? searchClans(server, trimmed)
          : Promise.resolve([]),
      ])
        .then(([nextPlayers, nextClans]) => {
          if (!active) {
            return;
          }

          setPlayers(nextPlayers);
          setClans(nextClans);
          setLoading(false);
        })
        .catch(fetchError => {
          if (!active) {
            return;
          }

          setLoading(false);
          setError(fetchError instanceof Error ? fetchError.message : 'Search failed.');
        });
    }, 350);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [query, server]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Search',
          headerStyle: {
            backgroundColor: '#f7f1e4',
          },
          headerTintColor: '#1f2f25',
          headerShadowVisible: false,
        }}
      />
      <PageScroll>
        <HeroCard
          eyebrow="Search"
          title="Players and clans"
          body={`Server-aware lookup for player profiles, clan pages, and the new Expo player route chain. ${online != null ? `${getServerLabel(server)} online: ${online.toLocaleString()}` : ''}`}
          accentColor={accentColor}
        />

        {!hasWoWsAppKey() ? (
          <StateCard
            tone="warning"
            title="API key required"
            body={getWoWsAppKeyMessage()}
          />
        ) : null}

        <Section
          title="Search Input"
          subtitle="Clan search starts at 2 characters. Player search starts at 3."
        >
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>Game Server</Text>
            <ChipRow
              value={server}
              options={serverOptions.map(option => ({
                value: option.key,
                label: option.label,
              }))}
              onChange={setServer}
              accentColor={accentColor}
            />
            <Text style={styles.inputLabel}>Search Text</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search players or clans"
              placeholderTextColor="#7c7a73"
              style={styles.input}
            />
          </View>
        </Section>

        {loading ? (
          <StateCard
            title="Searching"
            body="The new Expo route uses direct API calls instead of the legacy native shell."
          />
        ) : null}

        {error ? <StateCard tone="warning" title="Search error" body={error} /> : null}

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={accentColor} size="large" />
          </View>
        ) : null}

        <Section
          title={`Clans - ${clans.length}`}
          subtitle="Legacy parity: clans remain visible beside player search results."
        >
          {clans.length === 0 ? (
            <StateCard
              title="No clan results"
              body="Enter 2 to 5 characters to query clan tags."
            />
          ) : (
            clans.map(clan => (
              <ListRow
                key={clan.clan_id}
                title={clan.tag}
                description={`${getServerLabel(clan.server)} clan`}
                trailing={String(clan.clan_id)}
                onPress={() => router.push(getClanRoute(clan.server, clan.clan_id))}
              />
            ))
          )}
        </Section>

        <Section
          title={`Players - ${players.length}`}
          subtitle="Selecting a player opens the new statistics hub and subpages."
        >
          {players.length === 0 ? (
            <StateCard
              title="No player results"
              body="Enter at least 3 characters to search for players."
            />
          ) : (
            players.map(player => (
              <ListRow
                key={player.account_id}
                title={player.nickname}
                description={getServerLabel(player.server)}
                trailing={String(player.account_id)}
                onPress={() => router.push(getPlayerRoute(player.server, player.account_id, player.nickname))}
              />
            ))
          )}
        </Section>
      </PageScroll>
    </>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    padding: 18,
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2f25',
  },
  input: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d6c6a7',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1f2f25',
  },
  loadingWrap: {
    paddingVertical: 8,
  },
});
