/**
 * SectionTitle.js
 *
 * A themed title
 */

import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {ThemeBackColour, TintTextColour} from '../../value/colour';
import {Title, useTheme} from 'react-native-paper';

export interface SectionTitleProps {
  title: string;
  back?: boolean;
  center?: boolean;
  style?: any;
  bold?: boolean;
}

export const SectionTitle = ({title, back, center, style, bold}: SectionTitleProps) => {
  const theme = useTheme();
  
  return (
    <Title
      style={[
        back ? ThemeBackColour() : null,
        {color: theme.colors.primary},
        styles.text,
        style,
        center ? {alignSelf: 'center'} : null,
        bold ? {fontSize: 32, fontWeight: 'bold'} : null,
      ]}>
      {title}
    </Title>
  );
}

const styles = StyleSheet.create({
  text: {
    paddingLeft: 16,
    paddingTop: 8,
  },
});
