// @ts-ignore
import {GREY, BLUE, RED} from 'react-native-material-color';
import {LOCAL} from './data';
import {useAppStore} from '../store/useAppStore';

const s = () => useAppStore.getState();

export const getThemeBackColour = () => {
  return {backgroundColor: s().isDarkMode ? GREY[900] : GREY[100]};
};

export const getViewBackColour = () => {
  return {backgroundColor: s().isDarkMode ? 'black' : 'white'};
};

export const getThemeColour = () => {
  return s().isDarkMode ? GREY[900] : GREY[100];
};

export const toggleDarkMode = () => {
  const next = !s().isDarkMode;
  s().setDarkMode(next);
  s().setData(LOCAL.darkMode, next);
};

export const getTintColour = () => {
  return s().getData(LOCAL.theme);
};

export const getTintTextColour = () => {
  let colour = getTintColour();
  if (!colour) {
    colour = BLUE;
  }
  return {color: colour[500]};
};

export const getTintBackgroundColour = () => {
  let colour = getTintColour();
  if (!colour) {
    colour = RED;
  }
  return colour[500];
};

export const setTintColour = (tint: unknown) => {
  s().setData(LOCAL.theme, tint);
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : {r: 0, g: 0, b: 0};
};

export const blendWithWhite = (hex: string, alpha: number): string => {
  const {r, g, b} = hexToRgb(hex);
  const wr = 255,
    wg = 255,
    wb = 255;
  const rr = Math.round(r * alpha + wr * (1 - alpha));
  const rg = Math.round(g * alpha + wg * (1 - alpha));
  const rb = Math.round(b * alpha + wb * (1 - alpha));
  return `rgb(${rr}, ${rg}, ${rb})`;
};

export const buildElevationColors = (tintHex: string) => ({
  level0: 'transparent',
  level1: blendWithWhite(tintHex, 0.05),
  level2: blendWithWhite(tintHex, 0.08),
  level3: blendWithWhite(tintHex, 0.11),
  level4: blendWithWhite(tintHex, 0.12),
  level5: blendWithWhite(tintHex, 0.14),
});
