/**
 * LoadingIndicator.js
 *
 * A simple loading indicator following current theme
 */

import React from 'react';
import {ActivityIndicator} from 'react-native';
import isIos from "react-native-device-detection"
// @ts-ignore
import {Blue, Grey} from 'react-native-material-color';
import {TintColour} from '../../value/colour';

export const LoadingIndicator = ({style}: any) => {
  let appTheme = TintColour();
  if (!appTheme) {
    appTheme = Blue;
  }

  return (
    <ActivityIndicator
      size={isIos ? 'small' : 'large'}
      color={!isIos ? appTheme[500] : Grey}
      style={[style, {marginTop: 8}]}
    />
  );
}
