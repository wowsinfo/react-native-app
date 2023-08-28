/**
 * IconLabel.js
 *
 * A label with an icon on top
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {IconButton, Text, useTheme} from 'react-native-paper';
import {TintColour} from '../../value/colour';

export interface IconLabelProps {
  info: number | string;
  icon: any;
  style?: any;
  otherProps?: any;
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
      {/* color={TintColour()[500]} */}
      <IconButton
        size={36}
        icon={icon}
        color={theme.colors.primary}
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
