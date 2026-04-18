import type {CSSProperties} from 'react';
import type {InfoLabelProps} from '../types';
import {Touchable} from './Touchable';

export function InfoLabel({
  title,
  info,
  left,
  right,
  className,
  style,
  onPress,
}: InfoLabelProps) {
  return (
    <Touchable
      fill
      className={className}
      onPress={onPress}
      style={{alignItems: left ? 'flex-start' : right ? 'flex-end' : 'center'}}
    >
      <div className="flex-1 items-center justify-center">
        <div className="mb-[-2px] text-center text-xs text-slate-500">{title}</div>
        <div className="mb-0.5 text-center text-base" style={style as CSSProperties}>
          {info}
        </div>
      </div>
    </Touchable>
  );
}
