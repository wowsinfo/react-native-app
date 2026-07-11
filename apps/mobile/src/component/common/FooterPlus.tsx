/**
 * FooterPlus.js
 *
 * This is a view that connect with WoWs Info footer
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ThemeBackColour} from '../../value/colour';

export interface FooterPlusProps {
  children: React.ReactNode;
  style?: any;
}

export const FooterPlus = ({children, style}: FooterPlusProps) => {
  const {similarView} = styles;
  return (
    <View style={[similarView, ThemeBackColour(), style]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  similarView: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
