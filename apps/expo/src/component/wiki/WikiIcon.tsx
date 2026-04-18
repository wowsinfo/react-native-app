/**
 * WikiIcon.js
 *
 * A 64x64 icon with a 'New' label
 */

import React from 'react';
import {View, Image, ImageSourcePropType} from 'react-native';
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

export const WikiIcon = ({
  item,
  scale,
  warship,
  selected,
  themeIcon,
  ...otherProps
}: WikiIconProps) => {
  let width = 80;
  if (scale) {
    width *= scale;
  }
  let theme = AppGlobalData.get(LOCAL.theme);

  let imageSrc: ImageSourcePropType = {
    uri: item.image ? item.image : item.icon,
  };
  // let defaultSrc: ImageSourcePropType = {uri: 'Unknown'};

  if (warship) {
    return (
      <View className="items-center justify-center rounded-lg border border-transparent">
        {item ? (
          item.new ? (
            <View className="absolute bottom-0 z-10 h-2 w-2 rounded-full" style={{backgroundColor: theme[500]}} />
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
        className="items-center justify-center rounded-lg border border-transparent"
        style={selected ? {borderColor: theme[500]} : null}
        {...otherProps}>
        {item.new ? (
          <View className="absolute bottom-0 z-10 h-2 w-2 rounded-full" style={{backgroundColor: AppGlobalData.get(LOCAL.theme)[500]}} />
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
};
