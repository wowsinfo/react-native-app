import type { ImageSourcePropType } from 'react-native';

export type LegacyIconName =
  | 'AchievementTab'
  | 'Battle'
  | 'Damage'
  | 'EXP'
  | 'Graph'
  | 'HitRatio'
  | 'KillDeathRatio'
  | 'Rank'
  | 'Ship'
  | 'WinRate';

const legacyIconMap: Record<LegacyIconName, ImageSourcePropType> = {
  AchievementTab: require('../../../assets/icons/legacy/AchievementTab.png'),
  Battle: require('../../../assets/icons/legacy/Battle.png'),
  Damage: require('../../../assets/icons/legacy/Damage.png'),
  EXP: require('../../../assets/icons/legacy/EXP.png'),
  Graph: require('../../../assets/icons/legacy/Graph.png'),
  HitRatio: require('../../../assets/icons/legacy/HitRatio.png'),
  KillDeathRatio: require('../../../assets/icons/legacy/KillDeathRatio.png'),
  Rank: require('../../../assets/icons/legacy/Rank.png'),
  Ship: require('../../../assets/icons/legacy/Ship.png'),
  WinRate: require('../../../assets/icons/legacy/WinRate.png'),
};

export function getLegacyIconSource(name: LegacyIconName) {
  return legacyIconMap[name];
}
