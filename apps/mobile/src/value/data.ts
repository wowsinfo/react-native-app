import {SafeStorage, SafeValue} from '../core';
import {Actions} from '../core/navigation/Actions';
import {getAvailablePurchases} from 'react-native-iap';
import {Alert, Platform} from 'react-native';
import {lang} from './lang';
import {APP as SharedAPP, LOCAL as SharedLOCAL, SAVED as SharedSAVED, SERVER as SharedSERVER} from '@wowsinfo/shared';

export const APP = SharedAPP;
export const LOCAL = SharedLOCAL;
export const SAVED = SharedSAVED;
export const SERVER = SharedSERVER;

/**
 * First launch
 */
export const getFirstLaunch = () => {
  return AppGlobalData.get(LOCAL.firstLaunch);
};

export const setFirstLaunch = (mode: boolean) => {
  AppGlobalData.set(LOCAL.firstLaunch, mode);
  SafeStorage.set(LOCAL.firstLaunch, mode);
};

export const getCurrDomain = () => {
  return SERVER[getCurrServer()];
};

export const getDomain = (index: number) => {
  return SERVER[index];
};

export const getCurrPrefix = () => {
  let prefix = getCurrDomain();
  if (prefix === 'com') {
    prefix = 'na';
  }
  return prefix;
};

export const getPrefix = (index: number) => {
  let prefix = getDomain(index);
  if (prefix === 'com') {
    prefix = 'na';
  }
  return prefix;
};

export const getCurrServer = () => {
  return SafeValue(AppGlobalData.get(LOCAL.userServer), 3);
};

export const setCurrServer = (index: number) => {
  let str = LOCAL.userServer;
  AppGlobalData.set(str, index);
  SafeStorage.set(str, index);
};

/**
 * User Language
 */
export const getUserLang = () => {
  return SafeValue(AppGlobalData.get(LOCAL.userLanguage), 'en');
};

export const setUserLang = (lang: string) => {
  let str = LOCAL.userLanguage;
  AppGlobalData.set(str, lang);
  SafeStorage.set(str, lang);
};

/**
 * API Language
 */
export const getAPILanguage = () => {
  return SafeValue(AppGlobalData.get(LOCAL.apiLanguage), 'en');
};

export const getAPILangName = () => {
  return getAPIList()[getAPILanguage()];
};

export const langStr = () => {
  return `&language=${getAPILanguage()}`;
};

export const getAPIList = () => {
  return AppGlobalData.get(SAVED.language);
};

export const setAPILanguage = (lang: string) => {
  let str = LOCAL.apiLanguage;
  AppGlobalData.set(str, lang);
  SafeStorage.set(str, lang);
};

/**
 * Swap Button
 */
export const getSwapButton = () => {
  return AppGlobalData.get(LOCAL.swapButton);
};

export const setSwapButton = (swap: boolean) => {
  AppGlobalData.shouldSwapButton = swap;
  let str = LOCAL.swapButton;
  AppGlobalData.set(str, swap);
  SafeStorage.set(str, swap);
};

/**
 * Last Location
 */
export const setLastLocation = (str: string) => {
  let loc = LOCAL.lastLocation;
  AppGlobalData.set(loc, str);
  SafeStorage.set(loc, str);
};

export const isProVersion = () => {
  return AppGlobalData.get(LOCAL.proVersion) === true;
};

export const setProVersion = (pro: boolean) => {
  let str = LOCAL.proVersion;
  AppGlobalData.set(str, pro);
  SafeStorage.set(str, pro);
};

/**
 * Check if the user is using pro version,
 * push to ProVersion if necessary
 * @returns whether pro version
 */
export const onlyProVersion = () => {
  if (isProVersion()) {
    return true;
  }
  // Only push if user is not using pro version
  Actions.ProVersion();
  return false;
};

export const validateProVersion = async (showAlert?: boolean) => {
  try {
    const history = await getAvailablePurchases();
    console.log(history);
    if (history.length > 0) {
      // Sort by date first
      let latest = history.sort(
        (a, b) => a.transactionDate - b.transactionDate,
      )[history.length - 1];
      console.log(latest);
      const receipt = latest.transactionReceipt;
      const date = latest.transactionDate;
      if (receipt && date) {
        console.log('Valid purchase');
        if (Platform.OS === 'android') {
          restorePurchase(latest.autoRenewingAndroid === true, showAlert);
          return;
        } else if (Platform.OS === 'ios') {
          // Check if it expires
          const purchaseDate = new Date(date);
          purchaseDate.setFullYear(purchaseDate.getFullYear() + 1);
          const todayDate = new Date();
          console.log(`today: ${todayDate}\nexpire: ${purchaseDate}`);
          restorePurchase(todayDate < purchaseDate, showAlert);
          return;
        }
      }
    }

    // Should not be pro version
    setProVersion(false);
    if (showAlert) {
      throw new Error(lang.iap_no_purchase_history);
    }
  } catch (err: any) {
    Alert.alert(err.message);
  }
};

const restorePurchase = (shouldRestore: boolean, showAlert?: boolean) => {
  console.log(`Restore purchase - ${shouldRestore}`);
  if (shouldRestore === true) {
    setProVersion(true);
    if (showAlert) {
      Actions.pop();
      Alert.alert(lang.pro_title, lang.iap_thx_for_support);
      setTimeout(() => {
        Actions.refresh();
      }, 500);
    }
  } else {
    throw new Error(lang.iap_pro_expired);
  }
};

export const getCurrDate = () => {
  return AppGlobalData.get(LOCAL.date);
};

/**
 * get the date now and update saved date
 */
export const updateCurrData = () => {
  const today = new Date().toDateString();
  let str = LOCAL.date;
  AppGlobalData.set(str, today);
  SafeStorage.set(str, today);
};

export const differentMonth = () => {
  const today = new Date();
  const curr = new Date(getCurrDate());
  const sameMonth = today.getMonth() === curr.getMonth();
  console.log('Same month - ' + sameMonth);
  return sameMonth;
};

export const getLastUpdate = () => {
  return AppGlobalData.get(LOCAL.lastUpdate);
};

/**
 * Check if it has been 7 compared to curr date
 */
export const shouldUpdateWithCycle = () => {
  const curr = new Date(getCurrDate());
  const last = new Date(getLastUpdate());

  const diff = Math.abs(curr.getTime() - last.getTime());
  // Convert ut to days
  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  console.log(`${diffDays} day(s)`);
  return diffDays >= 7;
};
