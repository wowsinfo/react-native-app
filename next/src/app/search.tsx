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
import { useAppPreferences } from '@/features/preferences/preferences-manager';
import {
  getServerLabel,
  getServerOptions,
  type GameServer,
} from '@/features/home/content';

export default function SearchScreen() {
  const router = useRouter();
  const { palette, tintColor, t, tf } = useAppPreferences();
  const styles = createStyles(palette);
  const serverOptions = getServerOptions(t);
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
          setError(fetchError instanceof Error ? fetchError.message : t('search_error_title'));
        });
    }, 350);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [query, server, t]);

  return (
    <>
      <Stack.Screen
        options={{
          title: t('common_search'),
        }}
      />
      <PageScroll>
        <HeroCard
          eyebrow={t('common_search')}
          title={t('search_title')}
          body={`${t('search_subtitle')}${online != null ? ` ${tf('search_online_suffix', getServerLabel(server, t), online.toLocaleString())}` : ''}`}
          accentColor={tintColor}
        />

        {!hasWoWsAppKey() ? (
          <StateCard
            tone="warning"
            title={t('search_api_required_title')}
            body={t('search_api_required_body')}
          />
        ) : null}

        <Section
          title={t('search_input_title')}
          subtitle={t('search_input_subtitle')}
        >
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>{t('common_server')}</Text>
            <ChipRow
              value={server}
              options={serverOptions.map(option => ({
                value: option.value,
                label: option.label,
              }))}
              onChange={setServer}
              accentColor={tintColor}
            />
            <Text style={styles.inputLabel}>{t('search_text_label')}</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={t('search_placeholder')}
              placeholderTextColor={palette.muted}
              style={styles.input}
            />
          </View>
        </Section>

        {loading ? (
          <StateCard title={t('search_loading_title')} body={t('search_loading_body')} />
        ) : null}

        {error ? <StateCard tone="warning" title={t('search_error_title')} body={error} /> : null}

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={tintColor} size="large" />
          </View>
        ) : null}

        <Section
          title={`${t('player_clan')} - ${clans.length}`}
          subtitle={t('search_clans_subtitle')}
        >
          {clans.length === 0 ? (
            <StateCard title={t('player_clan')} body={t('search_clans_empty')} />
          ) : (
            clans.map(clan => (
              <ListRow
                key={clan.clan_id}
                title={clan.tag}
                description={tf('search_clan_description', getServerLabel(clan.server, t))}
                trailing={String(clan.clan_id)}
                onPress={() => router.push(getClanRoute(clan.server, clan.clan_id))}
              />
            ))
          )}
        </Section>

        <Section
          title={`${t('player_title')} - ${players.length}`}
          subtitle={t('search_players_subtitle')}
        >
          {players.length === 0 ? (
            <StateCard title={t('player_title')} body={t('search_players_empty')} />
          ) : (
            players.map(player => (
              <ListRow
                key={player.account_id}
                title={player.nickname}
                description={getServerLabel(player.server, t)}
                trailing={String(player.account_id)}
                onPress={() =>
                  router.push(getPlayerRoute(player.server, player.account_id, player.nickname))
                }
              />
            ))
          )}
        </Section>
      </PageScroll>
    </>
  );
}

function createStyles(palette: ReturnType<typeof useAppPreferences>['palette']) {
  return StyleSheet.create({
    inputWrap: {
      padding: 18,
      gap: 12,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: palette.text,
    },
    input: {
      minHeight: 52,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.surface,
      paddingHorizontal: 16,
      fontSize: 16,
      color: palette.text,
    },
    loadingWrap: {
      paddingVertical: 8,
    },
  });
}
