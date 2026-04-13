'use client';

import Link from 'next/link';
import type {ReactNode} from 'react';
import {useEffect, useState} from 'react';
import type {
  FavoriteClan,
  FavoritePlayer,
  SearchClan,
  SearchPlayer,
  SearchSnapshot,
} from '@/domain/wows/models';
import {listServerDefinitions, type ServerDefinition} from '@/domain/wows/server';
import {useFavorites} from '@/features/favorites/web/use-favorites';
import {buildPlayerOverviewPath} from '@/features/router/player-routes';
import {emptySearchSnapshot} from '@/features/search/search-contract';
import {SearchResultCard} from './search-result-card';
import {useDebouncedValue} from './use-debounced-value';

type OnlineResponse = {
  playersOnline: number;
  server: string;
};

type ApiError = {
  message: string;
};

const servers = listServerDefinitions();
const defaultServer = servers.find((server) => server.id === 'na') ?? servers[0];

export function SearchPage() {
  const [serverId, setServerId] = useState<ServerDefinition['id']>(defaultServer.id);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchSnapshot>(emptySearchSnapshot(defaultServer));
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeServer = servers.find((server) => server.id === serverId) ?? defaultServer;
  const debouncedQuery = useDebouncedValue(query, 350);
  const {favorites, add, remove} = useFavorites();

  useEffect(() => {
    let cancelled = false;

    async function loadOnlineCount() {
      try {
        const response = await fetch(`/api/online?server=${serverId}`);
        const payload = response.ok
          ? ((await response.json()) as OnlineResponse)
          : ((await response.json()) as ApiError);

        if (cancelled) {
          return;
        }

        if ('message' in payload) {
          setOnlineCount(null);
          setError(payload.message);
          return;
        }

        setOnlineCount(payload.playersOnline);
      } catch {
        if (!cancelled) {
          setOnlineCount(null);
        }
      }
    }

    loadOnlineCount();

    return () => {
      cancelled = true;
    };
  }, [serverId]);

  useEffect(() => {
    let cancelled = false;

    async function loadSearch() {
      setError(null);

      if (debouncedQuery.trim().length < 2) {
        setResult(emptySearchSnapshot(activeServer, debouncedQuery.trim()));
        return;
      }

      setIsSearching(true);

      try {
        const response = await fetch(
          `/api/search?server=${serverId}&q=${encodeURIComponent(debouncedQuery)}`,
        );
        const payload = response.ok
          ? ((await response.json()) as SearchSnapshot)
          : ((await response.json()) as ApiError);

        if (cancelled) {
          return;
        }

        if ('message' in payload) {
          setResult(emptySearchSnapshot(activeServer, debouncedQuery.trim()));
          setError(payload.message);
          return;
        }

        setResult(payload);
      } catch {
        if (!cancelled) {
          setResult(emptySearchSnapshot(activeServer, debouncedQuery.trim()));
          setError('Search is unavailable right now.');
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }

    loadSearch();

    return () => {
      cancelled = true;
    };
  }, [activeServer, debouncedQuery, serverId]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="surface-panel overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-8 text-white sm:px-8">
          <div className="eyebrow text-white/65">WoWs Info Search</div>
          <h1 className="mt-3 font-display text-4xl leading-none tracking-tight sm:text-5xl">
            Legacy routing, rebuilt for browsers.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72 sm:text-base">
            The original app centered everything around a native search screen that jumped straight
            into player detail. This version keeps that fast entry point, but reworks the screen
            for wider layouts, direct links, and a clearer route model.
          </p>
        </div>

        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.25fr)_360px]">
          <section className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
              <label className="flex flex-col gap-2 text-sm text-muted">
                Search
                <input
                  className="field-shell"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={`${activeServer.prefix.toUpperCase()} player or clan`}
                  value={query}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-muted">
                Server
                <select
                  className="field-shell"
                  onChange={(event) => setServerId(event.target.value as ServerDefinition['id'])}
                  value={serverId}
                >
                  {servers.map((server) => (
                    <option key={server.id} value={server.id}>
                      {server.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <InlineStat label="Region" value={activeServer.prefix.toUpperCase()} />
              <InlineStat
                label="Players Online"
                value={onlineCount === null ? 'Unavailable' : onlineCount.toLocaleString()}
              />
              <InlineStat label="State" value={isSearching ? 'Searching' : 'Ready'} />
            </div>

            {error ? (
              <div className="rounded-2xl border border-danger/20 bg-danger/8 px-4 py-3 text-sm text-danger">
                {error}
              </div>
            ) : null}

            <SearchSection title={`Players (${result.players.length})`}>
              {result.players.length > 0 ? (
                result.players.map((player) => (
                  <PlayerSearchCard
                    favorites={favorites.players}
                    key={`${player.serverId}-${player.accountId}`}
                    onAdd={() => add({kind: 'player', value: player})}
                    onRemove={() => remove({kind: 'player', value: player})}
                    player={player}
                  />
                ))
              ) : (
                <EmptyState text="Type at least 3 characters to search players." />
              )}
            </SearchSection>

            <SearchSection title={`Clans (${result.clans.length})`}>
              {result.clans.length > 0 ? (
                result.clans.map((clan) => (
                  <ClanSearchCard
                    clan={clan}
                    favorites={favorites.clans}
                    key={`${clan.serverId}-${clan.clanId}`}
                    onAdd={() => add({kind: 'clan', value: clan})}
                    onRemove={() => remove({kind: 'clan', value: clan})}
                  />
                ))
              ) : (
                <EmptyState text="Type 2 to 5 characters to search clans." />
              )}
            </SearchSection>
          </section>

          <aside className="space-y-6">
            <section className="soft-panel p-5">
              <div className="eyebrow">Tracked Players</div>
              <div className="mt-4 space-y-3">
                {favorites.players.length > 0 ? (
                  favorites.players.map((player) => (
                    <TrackedPlayerCard
                      key={`${player.serverId}-${player.accountId}`}
                      onRemove={() => remove({kind: 'player', value: player})}
                      player={player}
                    />
                  ))
                ) : (
                  <EmptyState text="Saved players will appear here." />
                )}
              </div>
            </section>

            <section className="soft-panel p-5">
              <div className="eyebrow">Tracked Clans</div>
              <div className="mt-4 space-y-3">
                {favorites.clans.length > 0 ? (
                  favorites.clans.map((clan) => (
                    <TrackedClanCard
                      clan={clan}
                      key={`${clan.serverId}-${clan.clanId}`}
                      onRemove={() => remove({kind: 'clan', value: clan})}
                    />
                  ))
                ) : (
                  <EmptyState text="Saved clans will appear here." />
                )}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function SearchSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">{title}</div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

function PlayerSearchCard({
  player,
  favorites,
  onAdd,
  onRemove,
}: {
  player: SearchPlayer;
  favorites: FavoritePlayer[];
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <SearchResultCard
      actions={
        <>
          <Link
            className="action-chip action-chip-primary"
            href={buildPlayerOverviewPath(player.serverId, player.accountId)}
          >
            Open profile
          </Link>
          {favorites.some((entry) => entry.accountId === player.accountId) ? (
            <button className="action-chip" onClick={onRemove} type="button">
              Remove tracked
            </button>
          ) : (
            <button className="action-chip" onClick={onAdd} type="button">
              Track player
            </button>
          )}
        </>
      }
      meta={`Account ${player.accountId}`}
      title={player.nickname}
    />
  );
}

function ClanSearchCard({
  clan,
  favorites,
  onAdd,
  onRemove,
}: {
  clan: SearchClan;
  favorites: FavoriteClan[];
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <SearchResultCard
      actions={
        favorites.some((entry) => entry.clanId === clan.clanId) ? (
          <button className="action-chip" onClick={onRemove} type="button">
            Remove tracked
          </button>
        ) : (
          <button className="action-chip" onClick={onAdd} type="button">
            Track clan
          </button>
        )
      }
      meta={`Clan ${clan.clanId}`}
      title={`[${clan.tag}]`}
    />
  );
}

function TrackedPlayerCard({
  player,
  onRemove,
}: {
  player: FavoritePlayer;
  onRemove: () => void;
}) {
  return (
    <SearchResultCard
      actions={
        <>
          <Link
            className="action-chip action-chip-primary"
            href={buildPlayerOverviewPath(player.serverId, player.accountId)}
          >
            Open
          </Link>
          <button className="action-chip" onClick={onRemove} type="button">
            Remove
          </button>
        </>
      }
      meta={`Account ${player.accountId}`}
      title={player.nickname}
    />
  );
}

function TrackedClanCard({
  clan,
  onRemove,
}: {
  clan: FavoriteClan;
  onRemove: () => void;
}) {
  return (
    <SearchResultCard
      actions={
        <button className="action-chip" onClick={onRemove} type="button">
          Remove
        </button>
      }
      meta={`Clan ${clan.clanId}`}
      title={`[${clan.tag}]`}
    />
  );
}

function InlineStat({label, value}: {label: string; value: string}) {
  return (
    <div className="stat-tile">
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-ink">{value}</div>
    </div>
  );
}

function EmptyState({text}: {text: string}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white/50 px-4 py-5 text-sm text-muted">
      {text}
    </div>
  );
}

