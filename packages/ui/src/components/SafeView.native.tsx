import {SafeAreaView, View} from 'react-native';
import type {SafeViewProps} from '../types';

export function SafeView({children, className, style, backgroundColor}: SafeViewProps) {
  return (
    <View className={className ?? 'flex-1'} style={style}>
      <SafeAreaView style={{backgroundColor}} className="flex-1">
        {children}
      </SafeAreaView>
    </View>
  );
}
