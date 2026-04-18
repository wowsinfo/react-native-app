import {fetchJson} from '@/core/http/fetch-json';
import {formatTemplate} from '@/core/text/format-template';
import type {SearchClan, SearchPlayer} from './models';
import type {
  WowsPlayerPvpStats,
  WowsPlayerRecord,
  WowsPlayerShipRecord,
  WowsShipExpectedRecord,
  WowsShipRecord,
} from './player-records';
import type {ServerRuntimeConfig} from './runtime-config';
import type {ServerDefinition} from './server';
import {legacyApi} from './legacy-api';

type ApiArrayResponse<T> = {
  data?: T[];
  status?: string;
};

type OnlineResponse = {
  data?: {
    wows?: Array<{
      players_online?: number;
    }>;
  };
};

type ApiObjectResponse<T> = {
  data?: Record<string, T>;
  meta?: {
    hidden?: number[];
  };
  status?: string;
};

type RawPlayerPvpStats = {
  battles?: number;
  wins?: number;
  damage_dealt?: number;
  frags?: number;
  xp?: number;
  survived_battles?: number;
  planes_killed?: number;
  max_damage_dealt?: number;
  max_frags_battle?: number;
  max_xp?: number;
};

type RawPlayerRecord = {
  account_id?: number;
  nickname?: string;
  created_at?: number;
  last_battle_time?: number;
  leveling_tier?: number;
  statistics?: {
    pvp?: RawPlayerPvpStats;
  };
};

type RawShipStatsRecord = {
  ship_id?: number;
  last_battle_time?: number;
  pvp?: RawPlayerPvpStats;
};

type RawShipEncyclopediaRecord = {
  ship_id?: number;
  name?: string;
  nation?: string;
  type?: string;
  tier?: number;
  images?: {
    small?: string;
  };
  is_premium?: boolean;
  is_special?: boolean;
};

type RawPlayerAchievementResponse = {
  data?: Record<
    string,
    {
      battle?: Record<string, unknown>;
    }
  >;
};

type RawClanTagResponse = {
  data?: Record<
    string,
    {
      clan?: {
        tag?: string;
      };
    }
  >;
};

type RawPersonalRatingRecord = {
  average_damage_dealt?: number;
  average_frags?: number;
  win_rate?: number;
};

export type WowsApiClient = {
  searchPlayers(server: ServerDefinition, query: string): Promise<SearchPlayer[]>;
  searchClans(server: ServerDefinition, query: string): Promise<SearchClan[]>;
  getPlayersOnline(server: ServerDefinition): Promise<number>;
  getPlayerRecord(server: ServerDefinition, accountId: string): Promise<WowsPlayerRecord | null>;
  getPlayerClanTag(server: ServerDefinition, accountId: string): Promise<string | null>;
  getPlayerAchievementCount(server: ServerDefinition, accountId: string): Promise<number>;
  getPlayerShips(server: ServerDefinition, accountId: string): Promise<WowsPlayerShipRecord[]>;
  getShipEncyclopedia(
    server: ServerDefinition,
    shipIds: string[],
  ): Promise<Record<string, WowsShipRecord>>;
  getShipExpectedRecords(): Promise<Record<string, WowsShipExpectedRecord>>;
};

export function createWowsApiClient(config: ServerRuntimeConfig): WowsApiClient {
  return {
    async searchPlayers(server, query) {
      const url = formatTemplate(
        legacyApi.playerSearch,
        server.apiDomain,
        config.appId,
        encodeURIComponent(query),
      );
      const response = await fetchJson<ApiArrayResponse<{account_id: number; nickname: string}>>(url);
      const data = response.data ?? [];

      return data.map((item) => ({
        accountId: String(item.account_id),
        nickname: item.nickname,
        serverId: server.id,
      }));
    },
    async searchClans(server, query) {
      const url = formatTemplate(
        legacyApi.clanSearch,
        server.apiDomain,
        config.appId,
        encodeURIComponent(query),
      );
      const response = await fetchJson<ApiArrayResponse<{clan_id: number; tag: string}>>(url);
      const data = response.data ?? [];

      return data.map((item) => ({
        clanId: String(item.clan_id),
        tag: item.tag,
        serverId: server.id,
      }));
    },
    async getPlayersOnline(server) {
      const url = formatTemplate(legacyApi.playerOnline, server.apiDomain, config.appId);
      const response = await fetchJson<OnlineResponse>(url);
      const onlineCount = response.data?.wows?.[0]?.players_online;

      return typeof onlineCount === 'number' ? onlineCount : 0;
    },
    async getPlayerRecord(server, accountId) {
      const url = formatTemplate(legacyApi.playerInfo, server.apiDomain, config.appId, accountId);
      const response = await fetchJson<ApiObjectResponse<RawPlayerRecord>>(url);
      const player = response.data?.[accountId];

      if (!player) {
        return null;
      }

      return {
        accountId,
        nickname: player.nickname ?? accountId,
        serverId: server.id,
        createdAt: player.created_at ?? null,
        lastBattleAt: player.last_battle_time ?? null,
        levelingTier: player.leveling_tier ?? null,
        hidden: response.meta?.hidden?.includes(Number(accountId)) ?? false,
        pvp: normalizePvpStats(player.statistics?.pvp),
      };
    },
    async getPlayerClanTag(server, accountId) {
      const url = formatTemplate(legacyApi.playerClan, server.apiDomain, config.appId, accountId);
      const response = await fetchJson<RawClanTagResponse>(url);

      return response.data?.[accountId]?.clan?.tag ?? null;
    },
    async getPlayerAchievementCount(server, accountId) {
      const url = formatTemplate(
        legacyApi.playerAchievement,
        server.apiDomain,
        config.appId,
        accountId,
      );
      const response = await fetchJson<RawPlayerAchievementResponse>(url);
      const battle = response.data?.[accountId]?.battle;

      return battle ? Object.keys(battle).length : 0;
    },
    async getPlayerShips(server, accountId) {
      const url = formatTemplate(legacyApi.shipInfo, server.apiDomain, config.appId, accountId);
      const response = await fetchJson<ApiObjectResponse<RawShipStatsRecord[]>>(url);
      const ships = response.data?.[accountId] ?? [];

      return ships.map((ship) => ({
        shipId: String(ship.ship_id ?? ''),
        lastBattleAt: ship.last_battle_time ?? null,
        pvp: normalizePvpStats(ship.pvp),
      }));
    },
    async getShipEncyclopedia(server, shipIds) {
      if (shipIds.length === 0) {
        return {};
      }

      const url = formatTemplate(
        legacyApi.shipWiki,
        server.apiDomain,
        config.appId,
        shipIds.join('%2C'),
      );
      const response = await fetchJson<ApiObjectResponse<RawShipEncyclopediaRecord>>(url);
      const records = response.data ?? {};

      return Object.fromEntries(
        Object.entries(records).map(([shipId, ship]) => [
          shipId,
          {
            shipId,
            name: ship.name ?? shipId,
            nation: ship.nation ?? 'unknown',
            type: ship.type ?? 'unknown',
            tier: ship.tier ?? 0,
            imageSmall: ship.images?.small ?? null,
            isPremium: ship.is_premium === true,
            isSpecial: ship.is_special === true,
          },
        ]),
      );
    },
    async getShipExpectedRecords() {
      const response = await fetchJson<Record<string, RawPersonalRatingRecord>>(legacyApi.personalRating);

      return Object.fromEntries(
        Object.entries(response).map(([shipId, record]) => [
          shipId,
          {
            shipId,
            averageDamageDealt: record.average_damage_dealt ?? 0,
            averageFrags: record.average_frags ?? 0,
            winRate: record.win_rate ?? 0,
          },
        ]),
      );
    },
  };
}

function normalizePvpStats(raw: RawPlayerPvpStats | undefined): WowsPlayerPvpStats | null {
  if (!raw) {
    return null;
  }

  return {
    battles: raw.battles ?? 0,
    wins: raw.wins ?? 0,
    damageDealt: raw.damage_dealt ?? 0,
    frags: raw.frags ?? 0,
    xp: raw.xp ?? 0,
    survivedBattles: raw.survived_battles ?? 0,
    planesKilled: raw.planes_killed ?? 0,
    maxDamageDealt: raw.max_damage_dealt ?? 0,
    maxFragsBattle: raw.max_frags_battle ?? 0,
    maxXp: raw.max_xp ?? 0,
  };
}
