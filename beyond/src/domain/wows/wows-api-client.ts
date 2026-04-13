import {fetchJson} from '@/core/http/fetch-json';
import {formatTemplate} from '@/core/text/format-template';
import type {SearchClan, SearchPlayer} from './models';
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

export type WowsApiClient = {
  searchPlayers(server: ServerDefinition, query: string): Promise<SearchPlayer[]>;
  searchClans(server: ServerDefinition, query: string): Promise<SearchClan[]>;
  getPlayersOnline(server: ServerDefinition): Promise<number>;
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
  };
}

