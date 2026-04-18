/**
 * IconLabel.js
 *
 * A label with an icon on top
 */

import React from 'react';
import {View} from 'react-native';
import {IconButton, Text, useTheme} from 'react-native-paper';

export interface IconLabelProps {
  info: number | string;
  icon: any;
  style?: any;
  className?: string;
  otherProps?: any;
}

export const IconLabel = ({
  info,
  icon,
  style,
  className,
  ...otherProps
}: IconLabelProps) => {
  const theme = useTheme();
  console.log(style);
  return (
    <View className={`items-center justify-center p-1 ${className ?? ''}`.trim()} style={style}>
      {/* color={TintColour()[500]} */}
      <IconButton
        size={36}
        icon={icon}
        color={theme.colors.primary}
        {...otherProps}
      />
      <Text style={{fontSize: 14}}>{info}</Text>
    </View>
  );
};
