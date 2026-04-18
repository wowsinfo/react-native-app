import type {CSSProperties} from 'react';
import type {SafeViewProps} from '../types';

export function SafeView({children, className, style, backgroundColor}: SafeViewProps) {
  return (
    <div className={className ?? 'min-h-screen flex-1'} style={{...(style as CSSProperties), backgroundColor}}>
      {children}
    </div>
  );
}
