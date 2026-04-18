import {Pressable, View} from 'react-native';
import type {TouchableProps} from '../types';

export function Touchable({
  children,
  className,
  style,
  fill,
  onPress,
  disabled,
}: TouchableProps) {
  return (
    <Pressable className={fill ? 'flex-1' : undefined} disabled={disabled} onPress={onPress}>
      <View className={className} style={style}>
        {children}
      </View>
    </Pressable>
  );
}
