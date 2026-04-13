import type {SearchEntitiesInput, SearchQueryRules} from './search-contract';
import {emptySearchSnapshot} from './search-contract';

export function getSearchQueryRules(rawQuery: string): SearchQueryRules {
  const query = rawQuery.trim();

  return {
    canSearchClans: query.length >= 2 && query.length <= 5,
    canSearchPlayers: query.length >= 3,
  };
}

export async function searchEntities({
  client,
  query: rawQuery,
  server,
}: SearchEntitiesInput) {
  const query = rawQuery.trim();
  const rules = getSearchQueryRules(query);

  if (!rules.canSearchClans && !rules.canSearchPlayers) {
    return emptySearchSnapshot(server, query);
  }

  const [clans, players] = await Promise.all([
    rules.canSearchClans ? client.searchClans(server, query) : Promise.resolve([]),
    rules.canSearchPlayers ? client.searchPlayers(server, query) : Promise.resolve([]),
  ]);

  return {
    query,
    server: server.id,
    players,
    clans,
  };
}

