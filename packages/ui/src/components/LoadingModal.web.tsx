import type {LoadingModalProps} from '../types';
import {LoadingIndicator} from './LoadingIndicator';

export function LoadingModal({visible = true, className, text = 'Loading...'}: LoadingModalProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className={className ?? 'fixed inset-0 flex items-center justify-center bg-black/70'}>
      <div className="rounded-lg bg-slate-900 p-4 text-white">
        <LoadingIndicator className="mx-auto" />
        <div className="mt-4">{text}</div>
      </div>
    </div>
  );
}
