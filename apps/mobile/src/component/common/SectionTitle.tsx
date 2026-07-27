/**
 * SectionTitle.js
 *
 * A themed title
 */

import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {getThemeBackColour} from '../../value/colour';
import {Title, useTheme} from 'react-native-paper';

export interface SectionTitleProps {
  title: string;
  back?: boolean;
  center?: boolean;
  style?: ViewStyle;
  bold?: boolean;
}

export const SectionTitle = ({
  title,
  back,
  center,
  style,
  bold,
}: SectionTitleProps) => {
  const theme = useTheme();

  return (
    <Title
      style={[
        back ? getThemeBackColour() : null,
        {color: theme.colors.onSurface},
        styles.text,
        style,
        center ? {alignSelf: 'center'} : null,
        bold ? {fontSize: 32, fontWeight: 'bold'} : null,
      ]}>
      {title}
    </Title>
  );
};

const styles = StyleSheet.create({
  text: {
    paddingLeft: 16,
    paddingTop: 8,
  },
});
