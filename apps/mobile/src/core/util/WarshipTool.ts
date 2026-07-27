import {SAVED} from '../../value/data';
import {
  getTierList,
  getTierLabel,
  getColourWithRange,
  getKeyByValue,
} from '@wowsinfo/core';

export {getTierList, getTierLabel, getColourWithRange, getKeyByValue};

export const filterShip = (data: Record<string, unknown>, shipData?: Array<Record<string, unknown>>) => {
  const {premium, name, nation, type, tier} = data;
  if (
    premium === false &&
    name == '' &&
    nation.length === 0 &&
    type.length === 0 &&
    tier.length === 0
  ) {
    return null;
  }
  const fname = name.toLowerCase();
  const fdata = normalise(nation, type, tier);
  const warship = AppGlobalData.get(SAVED.warship) as Record<string, unknown>;
  const filtered: Array<Record<string, unknown>> = [];
  if (shipData != null) {
    for (const ship of shipData) {
      const curr = warship[ship.ship_id];
      if (curr == null) continue;
      if (validShip(curr, fname, fdata, premium)) filtered.push(ship);
    }
  } else {
    for (const ID in warship) {
      const curr = warship[ID];
      if (validShip(curr, fname, fdata, premium)) filtered.push(curr);
    }
  }
  let sorted = filtered;
  if (shipData == null) {
    sorted = filtered.sort((a, b) => {
      if (a.tier === b.tier) return a.type.localeCompare(b.type);
      return b.tier - a.tier;
    });
  }
  return sorted;
};

const validShip = (curr: Record<string, unknown>, fname: string, fdata: Record<string, unknown>, premium: boolean) => {
  const ftier = fdata.tier,
    fnation = fdata.nation,
    ftype = fdata.type;
  let filterTier = false,
    filterName = false,
    filterNation = false,
    filterType = false,
    filterPremium = false;
  if (curr.name.toLowerCase().includes(fname) || fname.trim() === '')
    filterName = true;
  if (curr.premium === premium || premium === false) filterPremium = true;
  if (ftier[curr.tier] || isEmpty(ftier)) filterTier = true;
  if (fnation[curr.nation] || isEmpty(fnation)) filterNation = true;
  if (ftype[curr.type] || isEmpty(ftype)) filterType = true;
  return (
    filterName && filterNation && filterPremium && filterTier && filterType
  );
};

const isEmpty = (obj: Record<string, unknown>) => Object.keys(obj).length === 0;

const normalise = (nation: string[], type: string[], tier: string[]) => {
  const data: Record<string, Record<string, unknown>> = {nation: {}, type: {}, tier: {}};
  nation.forEach(i => {
    const key = getKeyByValue(
      (AppGlobalData.get(SAVED.encyclopedia) as Record<string, unknown>).ship_nations as Record<string, unknown>,
      i,
    );
    if (key == null) console.error('normalise: Invalid ship nation: ' + i);
    else data.nation[key] = true;
  });
  type.forEach(i => {
    const key = getKeyByValue(
      (AppGlobalData.get(SAVED.encyclopedia) as Record<string, unknown>).ship_types as Record<string, unknown>,
      i,
    );
    if (key == null) console.error('normalise: Invalid ship type: ' + i);
    else data.type[key] = true;
  });
  tier.forEach(i => {
    const index = getTierList().indexOf(i);
    if (index === -1) console.error('normalise: Invalid ship tier: ' + i);
    else data.tier[index + 1] = true;
  });
  return data;
};
