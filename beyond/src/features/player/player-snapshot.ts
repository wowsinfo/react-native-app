import type {ServerId} from '@/domain/wows/models';
import type {RatedShip} from '@/domain/wows/rating';
import type {WowsPlayerPvpStats, WowsPlayerRecord, WowsShipRecord} from '@/domain/wows/player-records';

export type PlayerHeaderSnapshot = {
  accountId: string;
  nickname: string;
  serverId: ServerId;
  serverLabel: string;
  clanTag: string | null;
  rating: number | null;
  pvp: WowsPlayerPvpStats | null;
  createdAt: number | null;
  lastBattleAt: number | null;
  levelingTier: number | null;
  achievementCount: number;
  shipCount: number;
  hidden: boolean;
};

export type PlayerOverviewSnapshot = {
  header: PlayerHeaderSnapshot;
  topShips: Array<RatedShip & {ship: WowsShipRecord | null}>;
};

export type PlayerShipsSnapshot = {
  header: PlayerHeaderSnapshot;
  ships: Array<RatedShip & {ship: WowsShipRecord | null}>;
};

export type PlayerShipDetailSnapshot = {
  header: PlayerHeaderSnapshot;
  ship: RatedShip & {ship: WowsShipRecord | null};
};

export type PlayerRouteInput = {
  serverId: string;
  accountId: string;
};

export type PlayerShipRouteInput = PlayerRouteInput & {
  shipId: string;
};

export type PlayerBaseBundle = {
  player: WowsPlayerRecord;
  clanTag: string | null;
  achievementCount: number;
  ratedShips: Array<RatedShip & {ship: WowsShipRecord | null}>;
  serverLabel: string;
};

