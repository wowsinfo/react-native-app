/**
 * WikiIcon.js
 *
 * A 64x64 icon with a 'New' label
 */

import React from 'react';
import {View, Image, StyleSheet, ImageSourcePropType} from 'react-native';
import {LOCAL} from '../../value/data';
import {Touchable} from '../common/Touchable';
import {useAppStore} from '../../store/useAppStore';

export interface WikiIconProps {
  item?: any;
  scale?: number;
  warship?: boolean;
  selected?: boolean;
  /// Force the icon to use the current theme instead
  themeIcon?: boolean;
  otherProps?: any;
}

export const WikiIcon = ({
  item,
  scale,
  warship,
  selected,
  themeIcon,
  ...otherProps
}: WikiIconProps) => {
  const {container, newLabel} = styles;
  let width = 80;
  if (scale) {
    width *= scale;
  }
  let theme = useAppStore.getState().getData(LOCAL.theme);
  const tint = theme?.[500];

  let imageSrc: ImageSourcePropType = {
    uri: item.image ? item.image : item.icon,
  };

  if (warship) {
    return (
      <View style={container}>
        {item?.new ? (
          <View style={[newLabel, {backgroundColor: tint || '#F44336'}]} />
        ) : null}
        <Image
          source={imageSrc}
          resizeMode="contain"
          tintColor={themeIcon ? tint : undefined}
          style={{width: width, height: width / 1.7}}
        />
      </View>
    );
  } else {
    return (
      <Touchable
        style={[container, selected ? {borderColor: tint} : null]}
        {...otherProps}>
        {item?.new ? (
          <View style={[newLabel, {backgroundColor: tint || '#F44336'}]} />
        ) : null}
        <Image
          source={imageSrc}
          tintColor={themeIcon ? tint : undefined}
          resizeMode="contain"
          style={{height: width, width: width}}
        />
      </Touchable>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  newLabel: {
    position: 'absolute',
    zIndex: 1,
    borderRadius: 99,
    bottom: 0,
    height: 8,
    width: 8,
  },
});
