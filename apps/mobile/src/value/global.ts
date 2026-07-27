import {AppGlobalData as GlobalData} from '@wowsinfo/core';

declare global {
  var AppGlobalData: typeof GlobalData;
}

globalThis.AppGlobalData = GlobalData;
