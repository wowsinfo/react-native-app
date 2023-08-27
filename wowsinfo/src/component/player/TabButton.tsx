/**
 * TabButton.js
 *
 * It is a styled button tab button
 */

import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';
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
  return (
    <Touchable
      fill
      style={styles.container}
      onPress={disabled ? null : onPress}>
      <IconButton icon={icon} size={26} {...otherProps} />
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
