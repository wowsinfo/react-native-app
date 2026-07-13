// @ts-ignore
import {GREY, BLUE, RED} from 'react-native-material-color';
import {LOCAL} from './data';
import {useAppStore} from '../store/useAppStore';

const s = () => useAppStore.getState();

export const ThemeBackColour = () => {
  return {backgroundColor: s().isDarkMode ? GREY[900] : GREY[100]};
};

export const ViewBackColour = () => {
  return {backgroundColor: s().isDarkMode ? 'black' : 'white'};
};

export const ThemeColour = () => {
  return s().isDarkMode ? GREY[900] : GREY[100];
};

export const UpdateDarkMode = () => {
  s().setDarkMode(!s().isDarkMode);
};

export const TintColour = () => {
  return s().getData(LOCAL.theme);
};

export const TintTextColour = () => {
  let colour = TintColour();
  if (!colour) {
    colour = BLUE;
  }
  return {color: colour[500]};
};

export const TintBackgroundColour = () => {
  let colour = TintColour();
  if (!colour) {
    colour = RED;
  }
  return colour[500];
};

export const UpdateTintColour = (tint: any) => {
  s().setData(LOCAL.theme, tint);
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16)}
    : {r: 0, g: 0, b: 0};
};

export const blendWithWhite = (hex: string, alpha: number): string => {
  const {r, g, b} = hexToRgb(hex);
  const wr = 255, wg = 255, wb = 255;
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
