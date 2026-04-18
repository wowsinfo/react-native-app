import type {CSSProperties} from 'react';
import type {FooterPlusProps} from '../types';

export function FooterPlus({children, className, style}: FooterPlusProps) {
  return (
    <div className={`rounded-t-2xl ${className ?? ''}`.trim()} style={style as CSSProperties}>
      {children}
    </div>
  );
}
