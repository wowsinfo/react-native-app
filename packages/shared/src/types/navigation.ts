import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export interface PlayerInfo {
  account_id: number;
  nickname: string;
  server: number;
}

export interface ClanInfoData {
  clan_id: number;
  tag: string;
  server: number;
}

export interface WarshipModuleData {
  ship_id: number;
  modules_tree: unknown[];
}

export type RootStackParamList = {
  Menu: undefined;
  Setup: undefined;
  Search: undefined | { query?: string };
  Statistics: { info: PlayerInfo };
  PlayerAchievement: { data: Record<string, number> };
  PlayerShip: undefined | { data?: unknown[]; rating?: unknown };
  PlayerShipDetail: { data: unknown };
  Rank: { data: Record<string, unknown>; ship: unknown };
  Rating: undefined;
  Graph: { data: unknown[] };
  ClanInfo: { info: ClanInfoData };
  Consumable: undefined | { upgrade?: boolean };
  BasicDetail: { item: unknown };
  CommanderSkill: undefined;
  Achievement: undefined;
  Map: undefined;
  Collection: undefined | { item?: unknown[] };
  Warship: undefined;
  WarshipFilter: undefined | { applyFunc?: (d: unknown) => void };
  WarshipDetail: { item: unknown; module?: unknown };
  WarshipModule: { data: WarshipModuleData };
  SimilarGraph: { info: unknown };
  Settings: undefined;
  About: undefined;
  License: undefined;
  ProVersion: undefined;
  RS: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
