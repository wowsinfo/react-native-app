import {View} from 'react-native';
import type {SpaceProps} from '../types';

export function Space({height = 128}: SpaceProps) {
  return <View className="w-full" style={{height}} />;
}
