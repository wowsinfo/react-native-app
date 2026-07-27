/**
 * Touchable.js
 *
 * A basic touchable view
 */

import React from "react";
import { View } from "react-native";
import { TouchableRipple } from "react-native-paper";

export interface TouchableProps {
  style?: object;
  children?: React.ReactNode;
  fill?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  otherProps?: Record<string, unknown>;
}

export const Touchable = ({
  style,
  children,
  fill,
  onPress,
  ...otherProps
}: TouchableProps) => {
  return (
    <TouchableRipple
      {...otherProps}
      style={fill ? { flex: 1 } : null}
      onPress={onPress}
    >
      <View style={style}>{children}</View>
    </TouchableRipple>
  );
};
