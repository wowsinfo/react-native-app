/**
 * TabButton.js
 *
 * It is a styled button tab button
 */

import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';
import {Touchable} from '../common/Touchable';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';

export interface TabButtonProps {
  icon: IconSource;
  disabled?: boolean;
  onPress?: () => void;
  otherProps?: any;
}

export const TabButton = ({
  icon,
  onPress,
  disabled,
  ...otherProps
}: TabButtonProps) => {
  const themes = useTheme();
  return (
    <Touchable
      fill
      style={styles.container}
      onPress={disabled ? undefined : onPress}>
      <IconButton
        icon={icon}
        size={26}
        color={themes.colors.primary}
        {...otherProps}
      />
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
});
