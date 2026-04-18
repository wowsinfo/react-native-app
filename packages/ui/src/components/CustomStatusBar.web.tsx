import type {StatusBarProps} from '../types';

export function CustomStatusBar({children, backgroundColor}: StatusBarProps) {
  return <div style={{backgroundColor}}>{children}</div>;
}
