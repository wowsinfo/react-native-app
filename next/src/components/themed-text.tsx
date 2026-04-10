import { Platform, Text, type TextProps, type TextStyle } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && textStyles.default,
        type === 'title' && textStyles.title,
        type === 'small' && textStyles.small,
        type === 'smallBold' && textStyles.smallBold,
        type === 'subtitle' && textStyles.subtitle,
        type === 'link' && textStyles.link,
        type === 'linkPrimary' && textStyles.linkPrimary,
        type === 'code' && textStyles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const textStyles = {
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  } satisfies TextStyle,
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  } satisfies TextStyle,
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  } satisfies TextStyle,
  title: {
    fontSize: 48,
    fontWeight: 600,
    lineHeight: 52,
  } satisfies TextStyle,
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: 600,
  } satisfies TextStyle,
  link: {
    lineHeight: 30,
    fontSize: 14,
  } satisfies TextStyle,
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    color: '#3c87f7',
  } satisfies TextStyle,
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  } satisfies TextStyle,
};
