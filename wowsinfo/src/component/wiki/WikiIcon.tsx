/**
 * WikiIcon.js
 *
 * A 64x64 icon with a 'New' label
 */

import React from 'react';
import {View, Image, StyleSheet, ImageSourcePropType} from 'react-native';
import {LOCAL} from '../../value/data';
import {Touchable} from '../common/Touchable';

export interface WikiIconProps {
  item?: any;
  scale?: number;
  warship?: boolean;
  selected?: boolean;
  /// Force the icon to use the current theme instead
  themeIcon?: boolean;
  otherProps?: any;
}

interface IconUri {
  uri: string;
}

export const WikiIcon = ({item, scale, warship, selected, themeIcon, ...otherProps}: WikiIconProps) => {
  const {container, newLabel} = styles;
  let width = 80;
  if (scale) {
    width *= scale;
  }
  let theme = AppGlobalData.get(LOCAL.theme);

  let imageSrc: ImageSourcePropType = {uri: item.image ? item.image : item.icon};
  // let defaultSrc: ImageSourcePropType = {uri: 'Unknown'};

  if (warship) {
    return (
      <View style={container}>
        {item ? (
          item.new ? (
            <View style={[newLabel, {backgroundColor: theme[500]}]} />
          ) : null
        ) : null}
        <Image
          source={imageSrc}
          resizeMode="contain"
          // defaultSource={defaultSrc}
          tintColor={themeIcon ? theme[500] : undefined}
          style={{width: width, height: width / 1.7}}
        />
      </View>
    );
  } else {
    return (
      <Touchable
        style={[container, selected ? {borderColor: theme[500]} : null]}
        {...otherProps}>
        {item.new ? (
          <View
            style={[
              newLabel,
              {backgroundColor: AppGlobalData.get(LOCAL.theme)[500]},
            ]}
          />
        ) : null}
        <Image
          source={imageSrc}
          tintColor={themeIcon ? theme[500] : undefined}
          resizeMode="contain"
          // defaultSource={defaultSrc}
          style={{height: width, width: width}}
        />
      </Touchable>
    );
  }
}

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

