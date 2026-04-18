import type {SpaceProps} from '../types';

export function Space({height = 128}: SpaceProps) {
  return <div aria-hidden className="w-full" style={{height}} />;
}
