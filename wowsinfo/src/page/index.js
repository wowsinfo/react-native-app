// This is the menu that we could access from anywhere
export * from './common/Filter';
export * from './common/Loading';

// Go to this page when app is first launched
import Menu from './home/Menu';
export {Menu};
export * from './home/Setup';
export * from './home/Friend';
import RS from './home/RS';
export {RS};
export * from './home/Search';

export * from './wiki/Consumable';
export * from './wiki/BasicDetail';
export * from './wiki/CommanderSkill';
export * from './wiki/Achievement';
export * from './wiki/Map';
export * from './wiki/Collection';
export * from './wiki/Warship';
export * from './wiki/WarshipDetail';
export * from './wiki/WarshipFilter';
export * from './wiki/WarshipModule';
export * from './wiki/SimilarGraph';

import Statistics from './player/Statistics';
export {Statistics};
export * from './player/PlayerAchievement';
export * from './player/Rating';
export * from './player/Graph';

export * from './clan/ClanInfo';

export * from './settings/About';
export * from './settings/License';
export * from './settings/ProVersion';
import Settings from './settings/Settings';
export {Settings};
