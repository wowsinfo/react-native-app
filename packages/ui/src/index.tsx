import type {PropsWithChildren} from 'react';
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type TextProps,
  type ViewProps,
} from 'react-native';

export function Surface({children, ...props}: PropsWithChildren<ViewProps>) {
  return <View {...props}>{children}</View>;
}

export function BodyText(props: TextProps) {
  return <Text {...props} />;
}

export function ActionButton(props: PressableProps) {
  return <Pressable {...props} />;
}

export type {PressableProps, TextProps, ViewProps};
