import {lang} from '../../value/lang';
import {Dimensions} from 'react-native';

/**
 * Deep clone an object
 * @param {*} value
 */
export const copy = (value: any) => {
  return JSON.parse(JSON.stringify(value));
};

/**
 * Return a number between 0 to range - 1
 * @param {int} range
 */
export const random = (range: number) => {
  return Math.floor(Math.random() * range);
};

export const roundTo = (num?: number, digit = 0) => {
  if (num == null) {
    return Number(-1);
  }
  if (isNaN(num) || !isFinite(num)) {
    return Number(-1);
  }
  return Number(Number(num).toFixed(digit));
};

/**
 * Get date difference in days
 * @param {*} time
 */
export const dayDifference = (time: number) => {
  let timeDiff = Math.abs(Date.now() / 1000 - time);
  return Math.ceil(timeDiff / (3600 * 24));
};

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

export const getRandomAnimation = () => {
  const list = [
    'bounce',
    'flash',
    'pulse',
    'rotate',
    'rubberBand',
    'shake',
    'swing',
    'tada',
    'wobble',
  ];
  return list[random(list.length)];
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
  console.log(width, deviceWidth);
  return deviceWidth / Math.max(1, Number(deviceWidth / width));
};

export const currDeviceWidth = () => {
  return Dimensions.get('window').width;
};
