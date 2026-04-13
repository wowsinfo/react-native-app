import type {ServerId} from './models';

export type WowsPlayerPvpStats = {
  battles: number;
  wins: number;
  damageDealt: number;
  frags: number;
  xp: number;
  survivedBattles: number;
  planesKilled: number;
  maxDamageDealt: number;
  maxFragsBattle: number;
  maxXp: number;
};

export type WowsPlayerRecord = {
  accountId: string;
  nickname: string;
  serverId: ServerId;
  createdAt: number | null;
  lastBattleAt: number | null;
  levelingTier: number | null;
  hidden: boolean;
  pvp: WowsPlayerPvpStats | null;
};

export type WowsPlayerShipRecord = {
  shipId: string;
  lastBattleAt: number | null;
  pvp: WowsPlayerPvpStats | null;
};

export type WowsShipRecord = {
  shipId: string;
  name: string;
  nation: string;
  type: string;
  tier: number;
  imageSmall: string | null;
  isPremium: boolean;
  isSpecial: boolean;
};

export type WowsShipExpectedRecord = {
  shipId: string;
  averageDamageDealt: number;
  averageFrags: number;
  winRate: number;
};

