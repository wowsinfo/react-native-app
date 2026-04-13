import type {ServerId} from '@/domain/wows/models';

export function buildPlayerOverviewPath(serverId: ServerId, accountId: string): string {
  return `/player/${serverId}/${accountId}`;
}

export function buildPlayerShipsPath(serverId: ServerId, accountId: string): string {
  return `${buildPlayerOverviewPath(serverId, accountId)}/ships`;
}

export function buildPlayerShipDetailPath(
  serverId: ServerId,
  accountId: string,
  shipId: string,
): string {
  return `${buildPlayerShipsPath(serverId, accountId)}/${shipId}`;
}

