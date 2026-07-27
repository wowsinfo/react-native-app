import {SafeValue} from '../util/SafeGuard';
import {roundTo} from '@wowsinfo/core';
import {SAVED} from '../../value/data';
import {lang} from '../../value/lang';
import {
  getAP,
  getRatingRange,
  getRatingIndex,
  getColourList,
  getColour,
} from '@wowsinfo/core';

export {getAP, getRatingRange, getRatingIndex, getColourList, getColour};

const getOverall = (id: string) => (AppGlobalData.get(SAVED.pr) as Record<string, unknown>)[id];

const calRating = (
  actualDmg: number,
  expectedDmg: number,
  actualWins: number,
  expectedWins: number,
  actualFrags: number,
  expectedFrags: number,
): number => {
  const rDmg = actualDmg / expectedDmg;
  const rWins = actualWins / expectedWins;
  const rFrags = actualFrags / expectedFrags;
  const nDmg = Math.max(0, (rDmg - 0.4) / (1 - 0.4));
  const nFrags = Math.max(0, (rFrags - 0.1) / (1 - 0.1));
  const nWins = Math.max(0, (rWins - 0.7) / (1 - 0.7));
  const rating = roundTo(700 * nDmg + 300 * nFrags + 150 * nWins);
  return Math.min(Number(rating), 9999);
};

export const getOverallRating = (ships: any): number => {
  if (ships == null) return -1;
  let actualDmg = 0,
    expectedDmg = 0,
    actualWins = 0,
    expectedWins = 0,
    actualFrags = 0,
    expectedFrags = 0;
  for (const ship of ships) {
    ship.rating = -1;
    ship.ap = 0;
    const pvp = SafeValue(ship.pvp, null);
    if (pvp) {
      const overall = getOverall(ship.ship_id) as Record<string, unknown>;
      if (overall == null) continue;
      const {battles, damage_dealt, frags, wins} = pvp;
      const {average_damage_dealt, average_frags, win_rate} = overall as {average_damage_dealt: number; average_frags: number; win_rate: number};
      if (battles === 0) continue;
      const currAvgDmg = damage_dealt / battles;
      const currWinrate = (wins / battles) * 100;
      const currFrags = frags / battles;
      ship.avgDmg = currAvgDmg;
      ship.avgWinrate = currWinrate;
      ship.avgFrags = currFrags;
      actualDmg += currAvgDmg;
      actualWins += currWinrate;
      actualFrags += currFrags;
      expectedDmg += average_damage_dealt;
      expectedWins += win_rate;
      expectedFrags += average_frags;
      const rating = calRating(
        currAvgDmg,
        average_damage_dealt,
        currWinrate,
        win_rate,
        currFrags,
        average_frags,
      );
      ship.rating = rating;
      ship.ap = getAP(rating, battles);
    }
  }
  return calRating(
    actualDmg,
    expectedDmg,
    actualWins,
    expectedWins,
    actualFrags,
    expectedFrags,
  );
};

export const getRatingList = (): string[] => [
  lang.rating_unknown,
  lang.rating_bad,
  lang.rating_below_average,
  lang.rating_average,
  lang.rating_good,
  lang.rating_very_good,
  lang.rating_great,
  lang.rating_unicum,
  lang.rating_super_unicum,
];

export const getComment = (rating: number): string => {
  const comments = getRatingList();
  const index = getRatingIndex(rating);
  const comment = comments[index];
  const range = getRatingRange()[index];
  const diff = range === 9999 ? rating - 2450 : range - rating;
  return `${comment} (+${diff})`;
};
