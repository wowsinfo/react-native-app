import {Text} from 'react-native';
import type {SectionTitleProps} from '../types';

export function SectionTitle({title, back, center, bold, className, style}: SectionTitleProps) {
  const classes = [
    'px-4 pt-2',
    back ? 'bg-slate-900' : '',
    center ? 'self-center' : '',
    bold ? 'text-3xl font-bold' : 'text-xl',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Text className={classes} style={style}>
      {title}
    </Text>
  );
}
