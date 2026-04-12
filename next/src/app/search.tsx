import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { formatNumber } from '@/features/player/format';
import { getClanRoute, getPlayerRoute } from '@/features/player/routes';
import {
  ChipRow,
  HeroCard,
  ListRow,
  PageScroll,
  Section,
  StateCard,
} from '@/features/player/ui';
import { useAppStateManager } from '@/features/app-state/app-state-manager';
import { useAppPreferences } from '@/features/preferences/preferences-manager';
import { createStackScreenOptions } from '@/features/preferences/theme';
import {
  getServerLabel,
  getServerOptions,
} from '@/features/home/content';

export default function SearchScreen() {
  const router = useRouter();
  const { gameServer, setGameServer, recentPlayers, rememberPlayer } = useAppStateManager();
  const { palette, tintColor, t, tf } = useAppPreferences();
  const serverOptions = getServerOptions(t);
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

    void fetchPlayersOnline(gameServer)
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
  }, [gameServer]);

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
        trimmed.length > 2 ? searchPlayers(gameServer, trimmed) : Promise.resolve([]),
        trimmed.length > 1 && trimmed.length < 6
          ? searchClans(gameServer, trimmed)
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
  }, [gameServer, query, t]);

  return (
    <>
      <Stack.Screen
        options={createStackScreenOptions(palette, {
          title: t('common_search'),
        })}
      />
      <PageScroll>
        <HeroCard
          eyebrow={t('common_search')}
          title={t('search_title')}
          body={`${t('search_subtitle')}${online != null ? ` ${tf('search_online_suffix', getServerLabel(gameServer, t), formatNumber(online))}` : ''}`}
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
          <View className="gap-3 p-[18px]">
            <Text className="text-[14px] font-bold text-foreground">
              {t('common_server')}
            </Text>
            <ChipRow
              value={gameServer}
              options={serverOptions.map(option => ({
                value: option.value,
                label: option.label,
              }))}
              onChange={setGameServer}
              accentColor={tintColor}
            />
            <Text className="text-[14px] font-bold text-foreground">
              {t('search_text_label')}
            </Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={t('search_placeholder')}
              placeholderTextColor={palette.muted}
              className="min-h-[52px] rounded-[14px] border border-line bg-surface px-4 text-[16px] text-foreground"
            />
          </View>
        </Section>

        {loading ? (
          <StateCard title={t('search_loading_title')} body={t('search_loading_body')} />
        ) : null}

        {error ? <StateCard tone="warning" title={t('search_error_title')} body={error} /> : null}

        {loading ? (
          <View className="py-2">
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
                onPress={() => {
                  rememberPlayer({
                    accountId: String(player.account_id),
                    nickname: player.nickname,
                    server: player.server,
                  });
                  router.push(getPlayerRoute(player.server, player.account_id, player.nickname));
                }}
              />
            ))
          )}
        </Section>

        {!query.trim() ? (
          <Section
            title={t('search_recent_players')}
            subtitle={t('search_recent_players_subtitle')}
          >
            {recentPlayers.length === 0 ? (
              <StateCard
                title={t('search_recent_players')}
                body={t('search_recent_empty')}
              />
            ) : (
              recentPlayers.map(player => (
                <ListRow
                  key={`${player.server}-${player.accountId}`}
                  title={player.nickname}
                  description={getServerLabel(player.server, t)}
                  trailing={player.accountId}
                  onPress={() =>
                    router.push(
                      getPlayerRoute(player.server, player.accountId, player.nickname),
                    )
                  }
                />
              ))
            )}
          </Section>
        ) : null}
      </PageScroll>
    </>
  );
}
