import {Modal, Text, View} from 'react-native';
import {LoadingIndicator} from './LoadingIndicator';
import type {LoadingModalProps} from '../types';

export function LoadingModal({visible = true, className, text = 'Loading...'}: LoadingModalProps) {
  return (
    <Modal transparent visible={visible}>
      <View className={className ?? 'items-center justify-center rounded-lg bg-black/70 p-4'}>
        <LoadingIndicator />
        <Text className="mt-4 text-white">{text}</Text>
      </View>
    </Modal>
  );
}
