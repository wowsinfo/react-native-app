import {ActivityIndicator, Platform} from 'react-native';
import type {LoadingIndicatorProps} from '../types';

export function LoadingIndicator({className, style, color}: LoadingIndicatorProps) {
  return (
    <ActivityIndicator
      className={className}
      size={Platform.OS === 'ios' ? 'small' : 'large'}
      color={color}
      style={[{marginTop: 8}, style]}
    />
  );
}
