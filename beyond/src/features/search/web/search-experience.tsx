'use client';

import {Children, type ReactNode, useEffect, useState} from 'react';
import type {
  FavoriteClan,
  FavoritePlayer,
  SearchClan,
  SearchPlayer,
  SearchSnapshot,
} from '@/domain/wows/models';
import {listServerDefinitions, type ServerDefinition} from '@/domain/wows/server';
import {useFavorites} from '@/features/favorites/web/use-favorites';
import {emptySearchSnapshot} from '@/features/search/search-contract';
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

export function SearchExperience() {
  const [serverId, setServerId] = useState<ServerDefinition['id']>(defaultServer.id);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchSnapshot>(emptySearchSnapshot(defaultServer));
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(query, 350);
  const activeServer = servers.find((server) => server.id === serverId) ?? defaultServer;
  const {favorites, add, remove} = useFavorites();

  useEffect(() => {
    let isActive = true;

    async function loadOnlineCount() {
      try {
        const response = await fetch(`/api/online?server=${serverId}`);
        const payload = response.ok
          ? ((await response.json()) as OnlineResponse)
          : ((await response.json()) as ApiError);

        if (!isActive) {
          return;
        }

        if ('message' in payload) {
          setOnlineCount(null);
          setError(payload.message);
          return;
        }

        setOnlineCount(payload.playersOnline);
      } catch {
        if (isActive) {
          setOnlineCount(null);
        }
      }
    }

    loadOnlineCount();

    return () => {
      isActive = false;
    };
  }, [serverId]);

  useEffect(() => {
    let isActive = true;

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

        if (!isActive) {
          return;
        }

        if ('message' in payload) {
          setResult(emptySearchSnapshot(activeServer, debouncedQuery.trim()));
          setError(payload.message);
          return;
        }

        setResult(payload);
      } catch {
        if (isActive) {
          setResult(emptySearchSnapshot(activeServer, debouncedQuery.trim()));
          setError('Search is unavailable right now.');
        }
      } finally {
        if (isActive) {
          setIsSearching(false);
        }
      }
    }

    loadSearch();

    return () => {
      isActive = false;
    };
  }, [activeServer, debouncedQuery, serverId]);

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero__eyebrow">Native UI, Shared Logic</div>
        <h1 className="hero__title">Beyond the legacy shell.</h1>
        <p className="hero__body">
          `wowsinfo/` mixed React Native screens, global state, and transport code in one place.
          `beyond/` starts from the opposite direction: a headless TypeScript engine, a Next.js web
          surface, and explicit contracts for future SwiftUI and Compose screens.
        </p>
        <div className="hero__meta">
          <div className="pill">Bun runtime</div>
          <div className="pill">Next.js App Router</div>
          <div className="pill">Shared search + favorites engine</div>
        </div>
      </section>

      <section className="stack">
        <div className="grid grid--content">
          <section className="panel">
            <header className="panel__header">
              <h2 className="panel__title">Search</h2>
              <p className="panel__body">
                This ports the intent of the old `Search` screen into a web-first slice that keeps
                server rules, fetch logic, and favorites outside the UI layer.
              </p>
            </header>

            <div className="controls">
              <div className="controls__row">
                <label className="field">
                  <span className="field__label">Query</span>
                  <input
                    className="field__input"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={`${activeServer.prefix.toUpperCase()} player or clan`}
                  />
                </label>

                <label className="field">
                  <span className="field__label">Server</span>
                  <select
                    className="field__select"
                    value={serverId}
                    onChange={(event) => setServerId(event.target.value as ServerDefinition['id'])}
                  >
                    {servers.map((server) => (
                      <option key={server.id} value={server.id}>
                        {server.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="status">
                <span>
                  Region prefix: <strong>{activeServer.prefix.toUpperCase()}</strong>
                </span>
                <span>
                  Online now:{' '}
                  <strong>{onlineCount === null ? 'Unavailable' : onlineCount.toLocaleString()}</strong>
                </span>
                <span>
                  State: <strong>{isSearching ? 'Searching' : 'Ready'}</strong>
                </span>
              </div>

              {error ? <div className="message message--error">{error}</div> : null}
            </div>

            <div className="stack">
              <SearchResultGroup
                title={`Clans (${result.clans.length})`}
                emptyMessage="Type 2 to 5 characters to search clans."
              >
                {result.clans.map((clan) => (
                  <SearchClanCard
                    key={`${clan.serverId}-${clan.clanId}`}
                    clan={clan}
                    isFavorite={favorites.clans.some((item) => item.clanId === clan.clanId)}
                    onAdd={() => add({kind: 'clan', value: clan})}
                    onRemove={() => remove({kind: 'clan', value: clan})}
                  />
                ))}
              </SearchResultGroup>

              <SearchResultGroup
                title={`Players (${result.players.length})`}
                emptyMessage="Type at least 3 characters to search players."
              >
                {result.players.map((player) => (
                  <SearchPlayerCard
                    key={`${player.serverId}-${player.accountId}`}
                    player={player}
                    isFavorite={favorites.players.some((item) => item.accountId === player.accountId)}
                    onAdd={() => add({kind: 'player', value: player})}
                    onRemove={() => remove({kind: 'player', value: player})}
                  />
                ))}
              </SearchResultGroup>
            </div>
          </section>

          <aside className="panel">
            <header className="panel__header">
              <h2 className="panel__title">Favorites</h2>
              <p className="panel__body">
                The old `Friend` screen becomes a plain storage-backed feature module that any UI
                surface can read or write.
              </p>
            </header>

            <div className="stack">
              <SearchResultGroup
                title={`Tracked Clans (${favorites.clans.length})`}
                emptyMessage="Saved clans will appear here."
              >
                {favorites.clans.map((clan) => (
                  <FavoriteClanCard
                    key={`${clan.serverId}-${clan.clanId}`}
                    clan={clan}
                    onRemove={() => remove({kind: 'clan', value: clan})}
                  />
                ))}
              </SearchResultGroup>

              <SearchResultGroup
                title={`Tracked Players (${favorites.players.length})`}
                emptyMessage="Saved players will appear here."
              >
                {favorites.players.map((player) => (
                  <FavoritePlayerCard
                    key={`${player.serverId}-${player.accountId}`}
                    player={player}
                    onRemove={() => remove({kind: 'player', value: player})}
                  />
                ))}
              </SearchResultGroup>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

type SearchResultGroupProps = {
  title: string;
  emptyMessage: string;
  children: ReactNode;
};

function SearchResultGroup({title, emptyMessage, children}: SearchResultGroupProps) {
  const itemCount = Children.count(children);

  return (
    <section className="result-group">
      <h3 className="result-group__title">{title}</h3>
      {itemCount > 0 ? (
        <div className="card-list">{children}</div>
      ) : (
        <div className="empty">{emptyMessage}</div>
      )}
    </section>
  );
}

type SearchClanCardProps = {
  clan: SearchClan;
  isFavorite: boolean;
  onAdd: () => void;
  onRemove: () => void;
};

function SearchClanCard({clan, isFavorite, onAdd, onRemove}: SearchClanCardProps) {
  return (
    <article className="entity-card">
      <div className="entity-card__row">
        <div>
          <h4 className="entity-card__title">[{clan.tag}]</h4>
          <div className="entity-card__meta">Clan ID {clan.clanId}</div>
        </div>
        <div className="pill">{clan.serverId.toUpperCase()}</div>
      </div>
      <div className="entity-card__actions">
        <button className="action action--primary" type="button">
          Native route placeholder
        </button>
        {isFavorite ? (
          <button className="action" type="button" onClick={onRemove}>
            Remove from tracked
          </button>
        ) : (
          <button className="action" type="button" onClick={onAdd}>
            Track clan
          </button>
        )}
      </div>
    </article>
  );
}

type SearchPlayerCardProps = {
  player: SearchPlayer;
  isFavorite: boolean;
  onAdd: () => void;
  onRemove: () => void;
};

function SearchPlayerCard({player, isFavorite, onAdd, onRemove}: SearchPlayerCardProps) {
  return (
    <article className="entity-card">
      <div className="entity-card__row">
        <div>
          <h4 className="entity-card__title">{player.nickname}</h4>
          <div className="entity-card__meta">Account ID {player.accountId}</div>
        </div>
        <div className="pill">{player.serverId.toUpperCase()}</div>
      </div>
      <div className="entity-card__actions">
        <button className="action action--primary" type="button">
          Native route placeholder
        </button>
        {isFavorite ? (
          <button className="action" type="button" onClick={onRemove}>
            Remove from tracked
          </button>
        ) : (
          <button className="action" type="button" onClick={onAdd}>
            Track player
          </button>
        )}
      </div>
    </article>
  );
}

type FavoriteClanCardProps = {
  clan: FavoriteClan;
  onRemove: () => void;
};

function FavoriteClanCard({clan, onRemove}: FavoriteClanCardProps) {
  return (
    <article className="entity-card">
      <div className="entity-card__row">
        <div>
          <h4 className="entity-card__title">[{clan.tag}]</h4>
          <div className="entity-card__meta">Clan ID {clan.clanId}</div>
        </div>
        <div className="pill">{clan.serverId.toUpperCase()}</div>
      </div>
      <div className="entity-card__actions">
        <button className="action" type="button" onClick={onRemove}>
          Remove
        </button>
      </div>
    </article>
  );
}

type FavoritePlayerCardProps = {
  player: FavoritePlayer;
  onRemove: () => void;
};

function FavoritePlayerCard({player, onRemove}: FavoritePlayerCardProps) {
  return (
    <article className="entity-card">
      <div className="entity-card__row">
        <div>
          <h4 className="entity-card__title">{player.nickname}</h4>
          <div className="entity-card__meta">Account ID {player.accountId}</div>
        </div>
        <div className="pill">{player.serverId.toUpperCase()}</div>
      </div>
      <div className="entity-card__actions">
        <button className="action" type="button" onClick={onRemove}>
          Remove
        </button>
      </div>
    </article>
  );
}
