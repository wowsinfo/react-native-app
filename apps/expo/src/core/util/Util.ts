import {Dimensions} from 'react-native';
import {lang} from '../../value/lang';
export {copy, dayDifference, random, roundTo} from '@repo/core';
export {getRandomAnimation} from '@repo/ui';

/**
 * Get a readable date string
 * @param {*} time
 */
export const humanTimeString = (time?: number) => {
  if (time == null) {
    return lang.warship_unknown;
  }
  if (time === 0) {
    return '---';
  }
  let obj = new Date(time * 1000);
  // first part to get date string and the second get locale time
  return `${obj
    .toISOString()
    .slice(0, 10)
    .split('-')
    .join('.')} ${obj.toLocaleTimeString()}`;
};

/**
 * Get the best cell width so that there won't be more than 6 items per row
 */
export const bestCellWidth = (target: number) => {
  const deviceWidth = Dimensions.get('window').width;
  const usualCount = deviceWidth / target;
  if (usualCount > 6) {
    return deviceWidth / 6;
  }
  return target;
};

/**
 * Get the cell width so that it fits the entire device width evenly
 */
export const bestCellWidthEven = (target: number) => {
  const deviceWidth = Dimensions.get('window').width;
  const usualCount = deviceWidth / target;
  const result = deviceWidth / Math.floor(usualCount);
  return result;
};

/**
 * Make sure the item isn't longer than the device,
 * if 2 items cannot be place just do one
 * @param {number} width
 */
export const bestWidth = (width: number, deviceWidth = currDeviceWidth()) => {
  const maxCount = Math.round(deviceWidth / width);
  return deviceWidth / Math.max(1, maxCount);
};

export const currDeviceWidth = () => {
  return Dimensions.get('window').width;
};
