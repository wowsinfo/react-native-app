/**
 * FooterPlus.js
 *
 * This is a view that connect with WoWs Info footer
 */

import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {getThemeBackColour} from '../../value/colour';

export interface FooterPlusProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const FooterPlus = ({children, style}: FooterPlusProps) => {
  const {similarView} = styles;
  return (
    <View style={[similarView, getThemeBackColour(), style]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  similarView: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
