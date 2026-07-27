/**
 * IconLabel.js
 *
 * A label with an icon on top
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {IconButton, Text, useTheme} from 'react-native-paper';

import type {ViewStyle} from 'react-native';

export interface IconLabelProps {
  info: number | string;
  icon: string;
  style?: ViewStyle;
  otherProps?: Record<string, unknown>;
}

export const IconLabel = ({
  info,
  icon,
  style,
  ...otherProps
}: IconLabelProps) => {
  const theme = useTheme();
  const {container, label} = styles;
  console.log(style);
  return (
    <View style={[container, style]}>
      {/* color={getTintColour()[500]} */}
      <IconButton
        size={36}
        icon={icon}
        iconColor={theme.colors.primary}
        {...otherProps}
      />
      <Text style={label}>{info}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  label: {
    fontSize: 14,
  },
});
