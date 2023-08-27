import {GREY, BLUE} from 'react-native-material-color';
import {LOCAL} from './data';
import {SafeStorage} from '../core';

export const ThemeBackColour = () => {
  return {backgroundColor: AppGlobalData.isDarkMode ? GREY[900] : GREY[100]};
};

export const ViewBackColour = () => {
  return {backgroundColor: AppGlobalData.isDarkMode ? 'black' : 'white'};
};

export const ThemeColour = () => {
  return AppGlobalData.isDarkMode ? GREY[900] : GREY[100];
};

export const UpdateDarkMode = () => {
  AppGlobalData.isDarkMode = !AppGlobalData.isDarkMode;
  SafeStorage.set(LOCAL.darkMode, AppGlobalData.isDarkMode);
};

export const TintColour = () => {
  return AppGlobalData.get(LOCAL.theme);
};

export const TintTextColour = () => {
  let colour = TintColour();
  if (!colour) {
    colour = BLUE;
  }
  return {color: colour[500]};
};

export const UpdateTintColour = tint => {
  AppGlobalData.set(LOCAL.theme, tint);
  SafeStorage.set(LOCAL.theme, tint);
};
