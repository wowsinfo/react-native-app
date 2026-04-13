import type {SearchSnapshot} from '@/domain/wows/models';
import type {ServerDefinition} from '@/domain/wows/server';
import type {WowsApiClient} from '@/domain/wows/wows-api-client';

export type SearchEntitiesInput = {
  client: WowsApiClient;
  query: string;
  server: ServerDefinition;
};

export type SearchQueryRules = {
  canSearchClans: boolean;
  canSearchPlayers: boolean;
};

export function emptySearchSnapshot(server: ServerDefinition, query = ''): SearchSnapshot {
  return {
    query,
    server: server.id,
    players: [],
    clans: [],
  };
}

