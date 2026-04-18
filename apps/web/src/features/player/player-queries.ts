import {notFound} from 'next/navigation';
import {createServerRuntimeConfig} from '@/domain/wows/runtime-config';
import {getServerDefinition} from '@/domain/wows/server';
import {createWowsApiClient} from '@/domain/wows/wows-api-client';
import {buildRatingSummary} from '@/domain/wows/rating';
import type {PlayerBaseBundle, PlayerOverviewSnapshot, PlayerRouteInput, PlayerShipDetailSnapshot, PlayerShipRouteInput, PlayerShipsSnapshot} from './player-snapshot';

export async function getPlayerOverviewSnapshot(
  input: PlayerRouteInput,
): Promise<PlayerOverviewSnapshot> {
  const bundle = await getPlayerBaseBundle(input);

  return {
    header: createHeader(bundle),
    topShips: [...bundle.ratedShips]
      .filter((ship) => ship.pvp?.battles && ship.ship)
      .sort((left, right) => (right.rating ?? -1) - (left.rating ?? -1))
      .slice(0, 6),
  };
}

export async function getPlayerShipsSnapshot(
  input: PlayerRouteInput,
): Promise<PlayerShipsSnapshot> {
  const bundle = await getPlayerBaseBundle(input);

  return {
    header: createHeader(bundle),
    ships: bundle.ratedShips,
  };
}

export async function getPlayerShipDetailSnapshot(
  input: PlayerShipRouteInput,
): Promise<PlayerShipDetailSnapshot> {
  const bundle = await getPlayerBaseBundle(input);
  const ship = bundle.ratedShips.find((entry) => entry.shipId === input.shipId);

  if (!ship) {
    notFound();
  }

  return {
    header: createHeader(bundle),
    ship,
  };
}

async function getPlayerBaseBundle(input: PlayerRouteInput): Promise<PlayerBaseBundle> {
  const server = getServerDefinition(input.serverId);
  const client = createWowsApiClient(createServerRuntimeConfig());

  const [player, clanTag, achievementCount, ships, expectedByShipId] = await Promise.all([
    client.getPlayerRecord(server, input.accountId),
    client.getPlayerClanTag(server, input.accountId),
    client.getPlayerAchievementCount(server, input.accountId),
    client.getPlayerShips(server, input.accountId),
    client.getShipExpectedRecords(),
  ]);

  if (!player) {
    notFound();
  }

  const ratingSummary = buildRatingSummary(ships, expectedByShipId);
  const encyclopedia = await client.getShipEncyclopedia(
    server,
    ratingSummary.ships.map((ship) => ship.shipId).filter(Boolean),
  );

  const ratedShips = ratingSummary.ships
    .map((ship) => ({
      ...ship,
      ship: encyclopedia[ship.shipId] ?? null,
    }))
    .sort((left, right) => (right.lastBattleAt ?? 0) - (left.lastBattleAt ?? 0));

  return {
    player: {
      ...player,
      hidden: player.hidden || ((player.pvp?.battles ?? 0) === 0 && !player.hidden),
    },
    clanTag,
    achievementCount,
    ratedShips,
    serverLabel: server.name,
  };
}

function createHeader(bundle: PlayerBaseBundle) {
  return {
    accountId: bundle.player.accountId,
    nickname: bundle.player.nickname,
    serverId: bundle.player.serverId,
    serverLabel: bundle.serverLabel,
    clanTag: bundle.clanTag,
    rating: bundle.ratedShips.length > 0
      ? buildHeaderRating(bundle)
      : null,
    pvp: bundle.player.pvp,
    createdAt: bundle.player.createdAt,
    lastBattleAt: bundle.player.lastBattleAt,
    levelingTier: bundle.player.levelingTier,
    achievementCount: bundle.achievementCount,
    shipCount: bundle.ratedShips.length,
    hidden: bundle.player.hidden,
  };
}

function buildHeaderRating(bundle: PlayerBaseBundle): number | null {
  let totalWeight = 0;
  let totalScore = 0;

  for (const ship of bundle.ratedShips) {
    if (ship.rating == null || !ship.pvp || ship.pvp.battles <= 0) {
      continue;
    }

    totalWeight += ship.pvp.battles;
    totalScore += ship.rating * ship.pvp.battles;
  }

  if (totalWeight === 0) {
    return null;
  }

  return Math.round(totalScore / totalWeight);
}

