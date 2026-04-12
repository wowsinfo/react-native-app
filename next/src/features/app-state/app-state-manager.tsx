import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { GameServer } from '@/features/home/content';
import type { ApiLanguage } from '@/features/settings/content';
import {
  readStoredJson,
  writeStoredJson,
} from '@/features/app-state/storage';

export type SavedPlayer = {
  accountId: string;
  nickname: string;
  server: GameServer;
};

type AppStateContextValue = {
  gameServer: GameServer;
  setGameServer: (server: GameServer) => void;
  apiLanguage: ApiLanguage;
  setApiLanguage: (language: ApiLanguage) => void;
  swapButtons: boolean;
  setSwapButtons: (enabled: boolean) => void;
  mainAccount: SavedPlayer | null;
  setMainAccount: (player: SavedPlayer) => void;
  friendAccounts: SavedPlayer[];
  addFriendAccount: (player: SavedPlayer) => void;
  isFriendAccount: (accountId: string) => boolean;
  recentPlayers: SavedPlayer[];
  rememberPlayer: (player: SavedPlayer) => void;
};

const GAME_SERVER_KEY = 'wowsinfo.gameServer';
const API_LANGUAGE_KEY = 'wowsinfo.apiLanguage';
const SWAP_BUTTONS_KEY = 'wowsinfo.swapButtons';
const MAIN_ACCOUNT_KEY = 'wowsinfo.mainAccount';
const FRIEND_ACCOUNTS_KEY = 'wowsinfo.friendAccounts';
const RECENT_PLAYERS_KEY = 'wowsinfo.recentPlayers';
const MAX_RECENT_PLAYERS = 8;

const AppStateContext = createContext<AppStateContextValue | null>(null);

function normalizePlayer(player: SavedPlayer): SavedPlayer {
  return {
    accountId: String(player.accountId),
    nickname: player.nickname,
    server: player.server,
  };
}

function areSamePlayer(left: SavedPlayer, right: SavedPlayer) {
  return (
    left.accountId === right.accountId &&
    left.nickname === right.nickname &&
    left.server === right.server
  );
}

function mergeRecentPlayers(players: SavedPlayer[], nextPlayer: SavedPlayer) {
  const normalized = normalizePlayer(nextPlayer);
  const current = players[0];

  if (current && areSamePlayer(current, normalized)) {
    return players;
  }

  return [
    normalized,
    ...players.filter(player => player.accountId !== normalized.accountId),
  ].slice(0, MAX_RECENT_PLAYERS);
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [gameServer, setGameServerState] = useState<GameServer>(
    () => readStoredJson<GameServer>(GAME_SERVER_KEY, 'asia'),
  );
  const [apiLanguage, setApiLanguageState] = useState<ApiLanguage>(
    () => readStoredJson<ApiLanguage>(API_LANGUAGE_KEY, 'en'),
  );
  const [swapButtons, setSwapButtonsState] = useState<boolean>(
    () => readStoredJson<boolean>(SWAP_BUTTONS_KEY, false),
  );
  const [mainAccount, setMainAccountState] = useState<SavedPlayer | null>(
    () => readStoredJson<SavedPlayer | null>(MAIN_ACCOUNT_KEY, null),
  );
  const [friendAccounts, setFriendAccounts] = useState<SavedPlayer[]>(
    () => readStoredJson<SavedPlayer[]>(FRIEND_ACCOUNTS_KEY, []),
  );
  const [recentPlayers, setRecentPlayers] = useState<SavedPlayer[]>(
    () => readStoredJson<SavedPlayer[]>(RECENT_PLAYERS_KEY, []),
  );

  useEffect(() => {
    writeStoredJson(GAME_SERVER_KEY, gameServer);
  }, [gameServer]);

  useEffect(() => {
    writeStoredJson(API_LANGUAGE_KEY, apiLanguage);
  }, [apiLanguage]);

  useEffect(() => {
    writeStoredJson(SWAP_BUTTONS_KEY, swapButtons);
  }, [swapButtons]);

  useEffect(() => {
    writeStoredJson(MAIN_ACCOUNT_KEY, mainAccount);
  }, [mainAccount]);

  useEffect(() => {
    writeStoredJson(FRIEND_ACCOUNTS_KEY, friendAccounts);
  }, [friendAccounts]);

  useEffect(() => {
    writeStoredJson(RECENT_PLAYERS_KEY, recentPlayers);
  }, [recentPlayers]);

  const setMainAccount = useCallback((player: SavedPlayer) => {
    const normalized = normalizePlayer(player);

    setMainAccountState(current =>
      current && areSamePlayer(current, normalized) ? current : normalized,
    );
    setRecentPlayers(prev => mergeRecentPlayers(prev, normalized));
  }, []);

  const addFriendAccount = useCallback((player: SavedPlayer) => {
    const normalized = normalizePlayer(player);

    setFriendAccounts(prev =>
      prev.some(item => item.accountId === normalized.accountId)
        ? prev
        : [...prev, normalized],
    );
    setRecentPlayers(prev => mergeRecentPlayers(prev, normalized));
  }, []);

  const isFriendAccount = useCallback(
    (accountId: string) => friendAccounts.some(player => player.accountId === String(accountId)),
    [friendAccounts],
  );

  const rememberPlayer = useCallback((player: SavedPlayer) => {
    setRecentPlayers(prev => mergeRecentPlayers(prev, player));
  }, []);

  const value = useMemo<AppStateContextValue>(
    () => ({
      gameServer,
      setGameServer: setGameServerState,
      apiLanguage,
      setApiLanguage: setApiLanguageState,
      swapButtons,
      setSwapButtons: setSwapButtonsState,
      mainAccount,
      setMainAccount,
      friendAccounts,
      addFriendAccount,
      isFriendAccount,
      recentPlayers,
      rememberPlayer,
    }),
    [
      addFriendAccount,
      apiLanguage,
      friendAccounts,
      gameServer,
      isFriendAccount,
      mainAccount,
      rememberPlayer,
      recentPlayers,
      setMainAccount,
      swapButtons,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppStateManager() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppStateManager must be used inside AppStateProvider.');
  }

  return context;
}
