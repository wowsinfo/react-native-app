import type { GameServer } from '@/features/home/content';

type PlayerRouteParams = {
  server: GameServer;
  accountId: string;
  nickname?: string;
};

export function getPlayerRoute(
  server: GameServer,
  accountId: string | number,
  nickname?: string,
){
  return {
    pathname: '/player/[server]/[accountId]',
    params: {
      server,
      accountId: String(accountId),
      nickname,
    } satisfies PlayerRouteParams,
  } as const;
}

export function getPlayerAchievementsRoute(
  server: GameServer,
  accountId: string | number,
  nickname?: string,
){
  return {
    pathname: '/player/[server]/[accountId]/achievements',
    params: {
      server,
      accountId: String(accountId),
      nickname,
    } satisfies PlayerRouteParams,
  } as const;
}

export function getPlayerShipsRoute(
  server: GameServer,
  accountId: string | number,
  nickname?: string,
){
  return {
    pathname: '/player/[server]/[accountId]/ships',
    params: {
      server,
      accountId: String(accountId),
      nickname,
    } satisfies PlayerRouteParams,
  } as const;
}

export function getPlayerShipDetailRoute(
  server: GameServer,
  accountId: string | number,
  shipId: string | number,
){
  return {
    pathname: '/player/[server]/[accountId]/ship/[shipId]',
    params: {
      server,
      accountId: String(accountId),
      shipId: String(shipId),
    },
  } as const;
}

export function getPlayerRankRoute(
  server: GameServer,
  accountId: string | number,
  nickname?: string,
){
  return {
    pathname: '/player/[server]/[accountId]/rank',
    params: {
      server,
      accountId: String(accountId),
      nickname,
    } satisfies PlayerRouteParams,
  } as const;
}

export function getPlayerGraphRoute(
  server: GameServer,
  accountId: string | number,
  nickname?: string,
){
  return {
    pathname: '/player/[server]/[accountId]/graph',
    params: {
      server,
      accountId: String(accountId),
      nickname,
    } satisfies PlayerRouteParams,
  } as const;
}

export function getClanRoute(
  server: GameServer,
  clanId: string | number,
){
  return {
    pathname: '/clan/[server]/[clanId]',
    params: {
      server,
      clanId: String(clanId),
    },
  } as const;
}
