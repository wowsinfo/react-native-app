import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Menu: undefined;
  Setup: undefined;
  Search: undefined | { query?: string };
  Statistics: { info: any };
  PlayerAchievement: { data: any };
  PlayerShip: undefined | { filter?: any };
  PlayerShipDetail: { data: any };
  Rank: { data: any; ship: any };
  Rating: undefined;
  Graph: { data: any };
  ClanInfo: { info: any };
  Consumable: undefined | { upgrade?: boolean };
  BasicDetail: { item: any };
  CommanderSkill: undefined;
  Achievement: undefined;
  Map: undefined;
  Collection: undefined | { item?: any };
  Warship: undefined;
  WarshipFilter: undefined | { applyFunc?: any };
  WarshipDetail: { item: any };
  WarshipModule: { data: any };
  SimilarGraph: { info: any };
  Settings: undefined;
  About: undefined;
  License: undefined;
  ProVersion: undefined;
  RS: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
