import {Text, View} from 'react-native';
import {Touchable} from './Touchable';

export function AppName() {
  return (
    <Touchable className="mx-2 mb-0 mt-2 flex-row">
      <View className="flex-1 justify-center pl-2">
        <Text className="font-bold text-xl text-slate-900">WoWs Info Seven</Text>
        <Text className="mt-[-8px] text-xs text-slate-500">Game launcher</Text>
      </View>
      <View className="h-16 w-16 items-center justify-center rounded-full bg-slate-900">
        <Text className="text-lg font-bold text-white">WI</Text>
      </View>
    </Touchable>
  );
}
