import {View} from 'react-native';
import type {FooterPlusProps} from '../types';

export function FooterPlus({children, className, style}: FooterPlusProps) {
  return (
    <View className={`rounded-t-2xl ${className ?? ''}`.trim()} style={style}>
      {children}
    </View>
  );
}
