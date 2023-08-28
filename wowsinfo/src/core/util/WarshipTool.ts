import {SAVED} from '../../value/data';

export const getTierLabel = (tier: number) => {
  if (tier < 1) {
    console.error('getTierLabel: Invalid tier: ' + tier);
    return 'O';
  }

  // From 1 to 15
  const label = getTierList();
  return label[tier - 1];
};

/**
 * A function that returns a colour between red and green depending on curr / max
 */
export const getColourWithRange = (min: number, curr: number, max: number) => {
  if (curr < min) {
    return '#FF0000';
  }
  let scale = Number(((curr - min) / (max - min)) * 100);

  const componentToHex = (c: number) => {
    let hex = c.toString(16);
    hex = hex.substring(0, 2);
    return hex.length == 1 ? '0' + hex : hex;
  }

  const rgbToHex = (r: number, g: number, b: number) =>  {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  let G = (255 * scale) / 100;
  let R = (255 * (100 - scale)) / 100;
  let colour = rgbToHex(R, G, 0);
  console.log(colour);
  return colour;
};

export const getKeyByValue = (object: any, value: any) => {
  return Object.keys(object).find(key => object[key] === value);
};

export const getTierList = () => {
  return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', '★'];
};

export const filterShip = (data: any, shipData?: Array<any>) => {
  const {premium, name, nation, type, tier} = data;
  console.log(data);
  if (
    premium === false &&
    name == '' &&
    nation.length === 0 &&
    type.length === 0 &&
    tier.length === 0
  ) {
    return null;
  }

  // nation, type and tier need to be normalised
  let fname = name.toLowerCase();
  let fdata = normalise(nation, type, tier);

  console.log(fdata);
  let warship = AppGlobalData.get(SAVED.warship);
  let filtered = [];
  if (shipData != null) {
    for (let ship of shipData) {
      let curr = warship[ship.ship_id];
      // Ignore removed ships
      if (curr == null) {
        continue;
      }
      if (validShip(curr, fname, fdata, premium)) {
        filtered.push(ship);
      }
    }
  } else {
    for (let ID in warship) {
      let curr = warship[ID];
      if (validShip(curr, fname, fdata, premium)) {
        filtered.push(curr);
      }
    }
  }

  let sorted = filtered;
  // shipData is sorted
  if (shipData == null) {
    sorted = filtered.sort((a, b) => {
      // Sort by tier, then by type
      if (a.tier === b.tier) {
        return a.type.localeCompare(b.type);
      } else {
        return b.tier - a.tier;
      }
    });
  }

  return sorted;
};

const validShip = (curr: any, fname: string, fdata: any, premium: boolean) => {
  let filterTier = false;
  let filterName = false;
  let filterNation = false;
  let filterType = false;
  let filterPremium = false;

  let ftier = fdata.tier;
  let fnation = fdata.nation;
  let ftype = fdata.type;

  // It includes this name or name is empty
  if (curr.name.toLowerCase().includes(fname) || fname.trim() === '') {
    filterName = true;
  }

  // ANote that if premium is not selected, all ships are valid
  if (curr.premium === premium || premium === false) {
    filterPremium = true;
  }

  // SAme tier or ftier is 0 (no value)
  if (ftier[curr.tier] || isEmpty(ftier)) {
    filterTier = true;
  }

  // Match or no value
  if (fnation[curr.nation] || isEmpty(fnation)) {
    filterNation = true;
  }

  // Match or no value
  if (ftype[curr.type] || isEmpty(ftype)) {
    filterType = true;
  }

  if (filterName && filterNation && filterPremium && filterTier && filterType) {
    return true;
  }
  return false;
};

const isEmpty = (obj: any) => {
  return Object.keys(obj).length === 0;
};

const normalise = (nation: Array<any>, type: Array<any>, tier: Array<any>) => {
  let data: any = {nation: {}, type: {}, tier: {}};

  nation.forEach(i => {
    const key = getKeyByValue(AppGlobalData.get(SAVED.encyclopedia).ship_nations, i);
    if (key == null) {
      console.error('normalise: Invalid ship nation: ' + i);
    } else {
      data.nation[key] = true;
    }
  });

  type.forEach(i => {
    const key = getKeyByValue(AppGlobalData.get(SAVED.encyclopedia).ship_types, i);
    if (key == null) {
      console.error('normalise: Invalid ship type: ' + i);
    } else {
      data.type[key] = true;
    }
  });

  tier.forEach(i => {
    const index = getTierList().indexOf(i);
    if (index === -1) {
      console.error('normalise: Invalid ship tier: ' + i);
    } else {
      data.tier[index + 1] = true;
    }
  });

  return data;
};
