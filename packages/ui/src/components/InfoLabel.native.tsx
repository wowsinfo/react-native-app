import {Text, View} from 'react-native';
import {Touchable} from './Touchable';
import type {InfoLabelProps} from '../types';

export function InfoLabel({
  title,
  info,
  left,
  right,
  className,
  style,
  onPress,
}: InfoLabelProps) {
  return (
    <Touchable
      fill
      className={className}
      onPress={onPress}
      style={{alignItems: left ? 'flex-start' : right ? 'flex-end' : 'center'}}
    >
      <View className="flex-1 items-center justify-center">
        <Text className="mb-[-2px] text-center text-xs text-slate-500">{title}</Text>
        <Text className="mb-0.5 text-center text-base" style={style}>{info}</Text>
      </View>
    </Touchable>
  );
}
