import {SafeAreaView, StatusBar, View} from 'react-native';
import type {StatusBarProps} from '../types';

export function CustomStatusBar({children, backgroundColor, dark}: StatusBarProps) {
  return (
    <View className="flex-1 bg-green-600">
      <SafeAreaView style={{backgroundColor}} />
      {children}
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
    </View>
  );
}
