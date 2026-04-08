import {
  getServerDomain,
  getServerPrefix,
  type GameServer,
} from '@/features/home/content';

const WOWS_APP_KEY = (process.env.EXPO_PUBLIC_WOWS_APP_KEY ?? '').trim();

type ApiListResponse<T> = {
  status?: 'ok' | 'error';
  error?: {message?: string};
  data?: T;
  meta?: {
    count?: number;
    hidden?: boolean | null;
  };
};

export type SearchPlayer = {
  account_id: number;
  nickname: string;
  server: GameServer;
};

export type SearchClan = {
  clan_id: number;
  tag: string;
  server: GameServer;
};

export type PlayerPvpStats = {
  battles?: number;
  wins?: number;
  losses?: number;
  draws?: number;
  damage_dealt?: number;
  damage_scouting?: number;
  frags?: number;
  xp?: number;
  art_agro?: number;
  torpedo_agro?: number;
  ships_spotted?: number;
  planes_killed?: number;
  survived_battles?: number;
  survived_wins?: number;
  max_damage_dealt?: number;
  max_damage_dealt_ship_id?: number;
  max_frags_battle?: number;
  max_frags_ship_id?: number;
  max_xp?: number;
  max_xp_ship_id?: number;
  max_damage_scouting?: number;
  max_scouting_damage_ship_id?: number;
  max_planes_killed?: number;
  max_planes_killed_ship_id?: number;
  max_ships_spotted?: number;
  max_ships_spotted_ship_id?: number;
  max_total_agro?: number;
  max_total_agro_ship_id?: number;
  aircraft?: WeaponStats;
  main_battery?: WeaponStats;
  ramming?: WeaponStats;
  second_battery?: WeaponStats;
  torpedoes?: WeaponStats;
};

export type WeaponStats = {
  frags?: number;
  hits?: number;
  shots?: number;
  max_frags_battle?: number;
  max_frags_ship_id?: number;
};

export type PlayerStatistics = {
  pvp?: PlayerPvpStats;
};

export type PlayerInfo = {
  account_id: number;
  nickname: string;
  created_at?: number;
  last_battle_time?: number;
  leveling_tier?: number;
  hidden_profile?: boolean;
  statistics?: PlayerStatistics;
};

export type ClanMembership = {
  clan?: {
    clan_id: number;
    tag: string;
  };
};

export type PlayerAchievementTotals = Record<string, number>;

export type AchievementMeta = {
  achievement_id: string;
  name: string;
  description?: string;
  image?: string;
};

export type ShipStats = {
  ship_id: number;
  last_battle_time?: number;
  pvp?: PlayerPvpStats;
};

export type RankSeasonInfo = {
  rank_info?: {
    rank?: number;
  };
  rank_solo?: PlayerPvpStats;
  rank_div2?: PlayerPvpStats;
  rank_div3?: PlayerPvpStats;
};

export type RankSeasonMap = Record<string, RankSeasonInfo>;
export type RankInfoResponse = Record<string, {seasons?: RankSeasonMap}>;

export type RankShipStats = {
  ship_id: number;
  seasons?: Record<string, Record<string, PlayerPvpStats>>;
};

export type ClanMember = {
  account_id: number;
  account_name: string;
  joined_at: number;
};

export type ClanInfo = {
  clan_id: number;
  tag: string;
  name?: string;
  created_at?: number;
  description?: string;
  members_count?: number;
  creator_name?: string;
  creator_id?: number;
  leader_name?: string;
  leader_id?: number;
  members?: Record<string, ClanMember>;
};

export type PlayerHubData = {
  basic: PlayerInfo | null;
  clanId: number | null;
  clanTag: string;
  ships: ShipStats[];
  achievements: PlayerAchievementTotals;
  rank: RankSeasonMap;
  rankShips: RankShipStats[];
  hidden: boolean;
};

export function hasWoWsAppKey() {
  return WOWS_APP_KEY.length > 0;
}

export function getWoWsAppKeyMessage() {
  return 'Set EXPO_PUBLIC_WOWS_APP_KEY to enable live World of Warships search and player data.';
}

export function getPlayerExternalUrl(server: GameServer, accountId: string, nickname: string) {
  const prefix = getServerPrefix(server);
  return `https://${prefix}.wows-numbers.com/player/${accountId},${encodeURIComponent(
    nickname,
  )}/`;
}

export function getClanExternalUrl(server: GameServer, clanId: string, tag: string) {
  const prefix = getServerPrefix(server);
  return `https://${prefix}.wows-numbers.com/clan/${clanId},${encodeURIComponent(tag)}/`;
}

function createApiUrl(
  server: GameServer,
  path: string,
  searchParams: Record<string, string>,
) {
  const domain = getServerDomain(server);
  const url = new URL(`https://api.worldofwarships.${domain}${path}`);
  url.searchParams.set('application_id', WOWS_APP_KEY);

  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}

function createWargamingUrl(
  server: GameServer,
  path: string,
  searchParams: Record<string, string>,
) {
  const domain = getServerDomain(server);
  const url = new URL(`https://api.worldoftanks.${domain}${path}`);
  url.searchParams.set('application_id', WOWS_APP_KEY);

  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}

async function fetchJson<T>(url: string): Promise<ApiListResponse<T>> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return (await response.json()) as ApiListResponse<T>;
}

function ensureAppKey() {
  if (!hasWoWsAppKey()) {
    throw new Error(getWoWsAppKeyMessage());
  }
}

function getRequiredData<T>(response: ApiListResponse<T>, fallback: T): T {
  if (response.status === 'error') {
    throw new Error(response.error?.message ?? 'WoWs API error');
  }

  return response.data ?? fallback;
}

export async function fetchPlayersOnline(server: GameServer) {
  ensureAppKey();

  const response = await fetchJson<{wows?: Array<{players_online?: number}>}>(
    createWargamingUrl(server, '/wgn/servers/info/', {
      fields: 'players_online',
      game: 'wows',
    }),
  );

  return response.data?.wows?.[0]?.players_online ?? null;
}

export async function searchPlayers(server: GameServer, query: string) {
  ensureAppKey();

  const response = await fetchJson<SearchPlayer[]>(
    createApiUrl(server, '/wows/account/list/', {
      search: query,
    }),
  );

  return getRequiredData(response, []).map(player => ({
    ...player,
    server,
  }));
}

export async function searchClans(server: GameServer, query: string) {
  ensureAppKey();

  const response = await fetchJson<SearchClan[]>(
    createApiUrl(server, '/wows/clans/list/', {
      fields: 'clan_id,tag',
      search: query,
    }),
  );

  return getRequiredData(response, []).map(clan => ({
    ...clan,
    server,
  }));
}

export async function fetchPlayerHub(
  server: GameServer,
  accountId: string,
): Promise<PlayerHubData> {
  ensureAppKey();

  const [basicResponse, clanResponse, shipResponse, achievementResponse, rankResponse, rankShipsResponse] =
    await Promise.all([
      fetchJson<Record<string, PlayerInfo>>(
        createApiUrl(server, '/wows/account/info/', {
          account_id: accountId,
        }),
      ),
      fetchJson<Record<string, ClanMembership>>(
        createApiUrl(server, '/wows/clans/accountinfo/', {
          account_id: accountId,
          extra: 'clan',
          fields: 'clan.tag,clan.clan_id',
        }),
      ),
      fetchJson<Record<string, ShipStats[]>>(
        createApiUrl(server, '/wows/ships/stats/', {
          account_id: accountId,
        }),
      ),
      fetchJson<Record<string, {battle?: PlayerAchievementTotals}>>(
        createApiUrl(server, '/wows/account/achievements/', {
          account_id: accountId,
          language: 'en',
          fields: 'battle',
        }),
      ),
      fetchJson<RankInfoResponse>(
        createApiUrl(server, '/wows/seasons/accountinfo/', {
          account_id: accountId,
        }),
      ),
      fetchJson<Record<string, RankShipStats[]>>(
        createApiUrl(server, '/wows/seasons/shipstats/', {
          account_id: accountId,
        }),
      ),
    ]);

  const basic = basicResponse.data?.[accountId] ?? null;
  const hidden =
    Boolean(basicResponse.meta?.hidden) ||
    basic?.hidden_profile === true ||
    (basic?.statistics?.pvp?.battles ?? 0) === 0;
  const clanId = clanResponse.data?.[accountId]?.clan?.clan_id ?? null;
  const clanTag = clanResponse.data?.[accountId]?.clan?.tag ?? '';
  const ships = shipResponse.data?.[accountId] ?? [];
  const achievements = achievementResponse.data?.[accountId]?.battle ?? {};
  const rank = rankResponse.data?.[accountId]?.seasons ?? {};
  const rankShips = rankShipsResponse.data?.[accountId] ?? [];

  return {
    basic,
    clanId,
    clanTag,
    ships,
    achievements,
    rank,
    rankShips,
    hidden,
  };
}

export async function fetchPlayerAchievements(
  server: GameServer,
  accountId: string,
) {
  ensureAppKey();

  const [totalsResponse, metaResponse] = await Promise.all([
    fetchJson<Record<string, {battle?: PlayerAchievementTotals}>>(
      createApiUrl(server, '/wows/account/achievements/', {
        account_id: accountId,
        language: 'en',
        fields: 'battle',
      }),
    ),
    fetchJson<Record<string, AchievementMeta>>(
      createApiUrl(server, '/wows/encyclopedia/achievements/', {
        fields:
          'battle.achievement_id,battle.name,battle.description,battle.image',
      }),
    ),
  ]);

  const totals = totalsResponse.data?.[accountId]?.battle ?? {};
  const catalogRoot = metaResponse.data ?? {};
  const catalog = Object.values(catalogRoot).reduce<Record<string, AchievementMeta>>(
    (all, item) => {
      if (item?.achievement_id) {
        all[item.achievement_id] = item;
      }

      return all;
    },
    {},
  );

  return Object.entries(totals)
    .map(([achievementId, count]) => ({
      achievementId,
      count,
      meta: catalog[achievementId] ?? null,
    }))
    .filter(item => item.count > 0)
    .sort((left, right) => right.count - left.count);
}

export async function fetchPlayerShips(server: GameServer, accountId: string) {
  ensureAppKey();

  const response = await fetchJson<Record<string, ShipStats[]>>(
    createApiUrl(server, '/wows/ships/stats/', {
      account_id: accountId,
    }),
  );

  return response.data?.[accountId] ?? [];
}

export async function fetchPlayerShipDetail(
  server: GameServer,
  accountId: string,
  shipId: string,
) {
  ensureAppKey();

  const response = await fetchJson<Record<string, ShipStats[]>>(
    createApiUrl(server, '/wows/ships/stats/', {
      account_id: accountId,
      ship_id: shipId,
    }),
  );

  return response.data?.[accountId]?.[0] ?? null;
}

export async function fetchPlayerRank(
  server: GameServer,
  accountId: string,
) {
  ensureAppKey();

  const [rankResponse, shipsResponse] = await Promise.all([
    fetchJson<RankInfoResponse>(
      createApiUrl(server, '/wows/seasons/accountinfo/', {
        account_id: accountId,
      }),
    ),
    fetchJson<Record<string, RankShipStats[]>>(
      createApiUrl(server, '/wows/seasons/shipstats/', {
        account_id: accountId,
      }),
    ),
  ]);

  return {
    seasons: rankResponse.data?.[accountId]?.seasons ?? {},
    ships: shipsResponse.data?.[accountId] ?? [],
  };
}

export async function fetchClanInfo(server: GameServer, clanId: string) {
  ensureAppKey();

  const response = await fetchJson<Record<string, ClanInfo>>(
    createApiUrl(server, '/wows/clans/info/', {
      clan_id: clanId,
      extra: 'members',
      fields:
        'created_at,creator_name,creator_id,leader_name,leader_id,description,name,members,members_count,tag',
    }),
  );

  return response.data?.[clanId] ?? null;
}
