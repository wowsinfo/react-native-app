import type {PropsWithChildren, ReactNode} from 'react';
import type {StyleProp, TextStyle, ViewStyle} from 'react-native';

export type SharedClassNameProps = {
  className?: string;
  style?: StyleProp<ViewStyle | TextStyle>;
};

export type TouchableProps = PropsWithChildren<{
  className?: string;
  style?: StyleProp<ViewStyle>;
  fill?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}>;

export type SpaceProps = {
  height?: number;
};

export type SectionTitleProps = {
  title: string;
  back?: boolean;
  center?: boolean;
  bold?: boolean;
  className?: string;
  style?: StyleProp<TextStyle>;
};

export type InfoLabelProps = PropsWithChildren<{
  title: string;
  info: string;
  left?: boolean;
  right?: boolean;
  className?: string;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
}>;

export type SafeViewProps = PropsWithChildren<{
  className?: string;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}>;

export type FooterPlusProps = PropsWithChildren<{
  className?: string;
  style?: StyleProp<ViewStyle>;
}>;

export type LoadingIndicatorProps = {
  className?: string;
  style?: StyleProp<ViewStyle>;
  color?: string;
};

export type LoadingModalProps = {
  visible?: boolean;
  className?: string;
  text?: string;
};

export type StatusBarProps = PropsWithChildren<{
  backgroundColor?: string;
  dark?: boolean;
  className?: string;
}>;
