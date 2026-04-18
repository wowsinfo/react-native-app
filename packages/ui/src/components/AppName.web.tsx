import {Touchable} from './Touchable';

export function AppName() {
  return (
    <Touchable className="mx-2 mb-0 mt-2 flex-row">
      <div className="flex-1 justify-center pl-2">
        <div className="text-xl font-bold text-slate-900">WoWs Info Seven</div>
        <div className="mt-[-8px] text-xs text-slate-500">Game launcher</div>
      </div>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
        WI
      </div>
    </Touchable>
  );
}
