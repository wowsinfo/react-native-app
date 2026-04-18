import type {CSSProperties} from 'react';
import type {SectionTitleProps} from '../types';

export function SectionTitle({title, back, center, bold, className, style}: SectionTitleProps) {
  const classes = [
    'px-4 pt-2 text-xl text-slate-900',
    back ? 'bg-slate-900' : '',
    center ? 'self-center' : '',
    bold ? 'text-3xl font-bold' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <h2 className={classes} style={style as CSSProperties}>
      {title}
    </h2>
  );
}
