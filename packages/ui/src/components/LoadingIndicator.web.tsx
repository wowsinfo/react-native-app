import type {CSSProperties} from 'react';
import type {LoadingIndicatorProps} from '../types';

export function LoadingIndicator({className, style, color}: LoadingIndicatorProps) {
  const spinnerStyle = color ? {borderTopColor: color, borderColor: color} : undefined;

  return (
    <div className={className} style={style as CSSProperties}>
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"
        style={spinnerStyle}
      />
    </div>
  );
}
