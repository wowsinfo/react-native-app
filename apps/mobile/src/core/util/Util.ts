import {lang} from '../../value/lang';
import {Dimensions} from 'react-native';
import {copy, random, roundTo, dayDifference, getRandomAnimation} from '@wowsinfo/core';

export {copy, random, roundTo, dayDifference, getRandomAnimation};

export const humanTimeString = (time?: number) => {
  if (time == null) return lang.warship_unknown;
  if (time === 0) return '---';
  const obj = new Date(time * 1000);
  return `${obj.toISOString().slice(0, 10).split('-').join('.')} ${obj.toLocaleTimeString()}`;
};

export const bestCellWidth = (target: number) => {
  const deviceWidth = Dimensions.get('window').width;
  const usualCount = deviceWidth / target;
  if (usualCount > 6) return deviceWidth / 6;
  return target;
};

export const bestCellWidthEven = (target: number) => {
  const deviceWidth = Dimensions.get('window')?.width || 390;
  const usualCount = deviceWidth / target;
  const result = deviceWidth / Math.floor(usualCount);
  return Number.isFinite(result) ? result : target;
};

export const bestWidth = (width: number, deviceWidth = currDeviceWidth()) => {
  const maxCount = Math.round(deviceWidth / width);
  const result = deviceWidth / Math.max(1, maxCount);
  return Number.isFinite(result) ? result : width;
};

export const currDeviceWidth = () => {
  return Dimensions.get('window')?.width || 390;
};
