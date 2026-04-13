export type ServerId = 'ru' | 'eu' | 'na' | 'asia';

export type SearchPlayer = {
  accountId: string;
  nickname: string;
  serverId: ServerId;
};

export type SearchClan = {
  clanId: string;
  tag: string;
  serverId: ServerId;
};

export type SearchSnapshot = {
  query: string;
  server: ServerId;
  players: SearchPlayer[];
  clans: SearchClan[];
};

export type FavoritePlayer = SearchPlayer;
export type FavoriteClan = SearchClan;

export type FavoritesSnapshot = {
  players: FavoritePlayer[];
  clans: FavoriteClan[];
};

export type SearchScreenPayload = {
  route: 'search.home';
  server: ServerId;
  query: string;
  onlineCount: number | null;
  favorites: FavoritesSnapshot;
  result: SearchSnapshot;
};

export type NativeRoutePayload = SearchScreenPayload;

