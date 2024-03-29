import {roundTo} from './Util';
import {SafeValue} from './SafeGuard';
import {SAVED} from '../../value/data';
import {lang} from '../../value/lang';

const getOverall = (id: string) => AppGlobalData.get(SAVED.pr)[id];

const calRating = (
  actualDmg: number,
  expectedDmg: number,
  actualWins: number,
  expectedWins: number,
  actualFrags: number,
  expectedFrags: number,
): number => {
  // From https://wows-numbers.com/personal/rating by Wiochi
  const rDmg = actualDmg / expectedDmg;
  const rWins = actualWins / expectedWins;
  const rFrags = actualFrags / expectedFrags;

  const nDmg = Math.max(0, (rDmg - 0.4) / (1 - 0.4));
  const nFrags = Math.max(0, (rFrags - 0.1) / (1 - 0.1));
  const nWins = Math.max(0, (rWins - 0.7) / (1 - 0.7));

  let rating = roundTo(700 * nDmg + 300 * nFrags + 150 * nWins);
  // Cap it to 9999
  return Math.min(Number(rating), 9999);
};

/**
 * Calculate rating for each ship and return an overall rating
 * @param {*} ships
 */
export const getOverallRating = (ships: any): number => {
  if (ships == null) {
    return -1;
  }

  let actualDmg = 0,
    expectedDmg = 0,
    actualWins = 0,
    expectedWins = 0,
    actualFrags = 0,
    expectedFrags = 0;
  for (let ship of ships) {
    ship.rating = -1;
    ship.ap = 0;

    const pvp = SafeValue(ship.pvp, null);
    if (pvp) {
      const overall = getOverall(ship.ship_id);
      if (overall == null) {
        continue;
      }

      const {battles, damage_dealt, frags, wins} = pvp;
      const {average_damage_dealt, average_frags, win_rate} = overall;

      if (battles === 0) {
        continue;
      }
      let currAvgDmg = damage_dealt / battles;
      let currWinrate = (wins / battles) * 100;
      let currFrags = frags / battles;
      ship.avgDmg = currAvgDmg;
      ship.avgWinrate = currWinrate;
      ship.avgFrags = currFrags;

      // Accumulate data
      actualDmg += currAvgDmg;
      actualWins += currWinrate;
      actualFrags += currFrags;
      expectedDmg += average_damage_dealt;
      expectedWins += win_rate;
      expectedFrags += average_frags;

      // Calculate rating and ap
      let rating = calRating(
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

export const getAP = (rating: number, battle: number): number => {
  if (rating === -1 || battle === 0) {
    return 0;
  } else {
    return Number(roundTo(Math.log10(Math.max(10, battle)) * rating));
  }
};

export const getRatingRange = (): Array<number> => [
  0, 750, 1100, 1350, 1550, 1750, 2100, 2450, 9999,
];

/**
 * Returns the index of the range that the given rating falls into.
 * @param rating The personal rating number
 * @returns The index of the rating. If the rating is invalid, returns 0 which is unknown
 */
export const getRatingIndex = (rating?: number): number => {
  if (rating == null) {
    return 0;
  }
  const range = getRatingRange();
  const index = range.findIndex(r => rating < r);
  return index === -1 ? 0 : index;
};

export const getColourList = (): Array<string> => [
  '#607D8B', // blue gray
  '#D32F2F', // red700
  '#FF9800', // orange
  '#FFB300', // amber600
  '#7CB342', // light green 600
  '#388E3C', // green700
  '#03A9F4', // blue (replacing cyan)
  '#9C27B0', // purple
  '#673AB7', // deep purple
  'black',
];

export const getColour = (rating?: number): string => {
  const colours = getColourList();
  return SafeValue(colours[getRatingIndex(rating)], '#607D8B');
};

export const getRatingList = (): Array<string> => [
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

  let index = getRatingIndex(rating);
  let comment = comments[index];
  let range = getRatingRange()[index];

  let diff = range - rating;
  // Prevent big numbers
  if (range === 9999) {
    diff = rating - 2450;
  }

  return `${comment} (+${diff})`;
};
