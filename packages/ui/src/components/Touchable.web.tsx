import type {CSSProperties} from 'react';
import type {TouchableProps} from '../types';

export function Touchable({
  children,
  className,
  style,
  fill,
  onPress,
  disabled,
}: TouchableProps) {
  return (
    <button
      className={[fill ? 'flex-1' : '', 'appearance-none border-0 bg-transparent p-0 text-left', className ?? ''].filter(Boolean).join(' ')}
      disabled={disabled}
      onClick={onPress}
      type="button"
      style={style as CSSProperties}
    >
      {children}
    </button>
  );
}
