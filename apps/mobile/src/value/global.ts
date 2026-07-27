import {AppGlobalData} from '@wowsinfo/core';

declare global {
  var AppGlobalData: any;
}

globalThis.AppGlobalData = AppGlobalData;
