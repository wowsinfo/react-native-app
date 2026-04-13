import {describe, expect, test} from 'bun:test';
import {getServerDefinition} from '@/domain/wows/server';
import {getSearchQueryRules, searchEntities} from './search-engine';

describe('search rules', () => {
  test('keeps the legacy clan threshold', () => {
    expect(getSearchQueryRules('ab')).toEqual({
      canSearchClans: true,
      canSearchPlayers: false,
    });
  });

  test('keeps the legacy player threshold', () => {
    expect(getSearchQueryRules('abc')).toEqual({
      canSearchClans: true,
      canSearchPlayers: true,
    });
  });
});

describe('search engine', () => {
  test('skips API work when the query is too short', async () => {
    const client = {
      searchPlayers: async () => {
        throw new Error('players should not be fetched');
      },
      searchClans: async () => {
        throw new Error('clans should not be fetched');
      },
      getPlayersOnline: async () => 0,
    };

    const result = await searchEntities({
      client,
      query: 'a',
      server: getServerDefinition('na'),
    });

    expect(result).toEqual({
      query: 'a',
      server: 'na',
      players: [],
      clans: [],
    });
  });

  test('merges player and clan results into one snapshot', async () => {
    const client = {
      searchPlayers: async () => [
        {
          accountId: '42',
          nickname: 'BeyondCaptain',
          serverId: 'na' as const,
        },
      ],
      searchClans: async () => [
        {
          clanId: '7',
          tag: 'BND',
          serverId: 'na' as const,
        },
      ],
      getPlayersOnline: async () => 0,
    };

    const result = await searchEntities({
      client,
      query: 'bnd',
      server: getServerDefinition('na'),
    });

    expect(result).toEqual({
      query: 'bnd',
      server: 'na',
      players: [
        {
          accountId: '42',
          nickname: 'BeyondCaptain',
          serverId: 'na',
        },
      ],
      clans: [
        {
          clanId: '7',
          tag: 'BND',
          serverId: 'na',
        },
      ],
    });
  });
});

