import {SafeValue} from '../core';
import {Actions} from '../core/navigation/Actions';
import {getAvailablePurchases} from 'react-native-iap';
import {Alert, Platform} from 'react-native';
import {lang} from './lang';
import {
  APP as SharedAPP,
  LOCAL as SharedLOCAL,
  SAVED as SharedSAVED,
  SERVER as SharedSERVER,
} from '@wowsinfo/shared';
import {useAppStore} from '../store/useAppStore';

export const APP = SharedAPP;
export const LOCAL = SharedLOCAL;
export const SAVED = SharedSAVED;
export const SERVER = SharedSERVER;

const s = () => useAppStore.getState();

/**
 * First launch
 */
export const getFirstLaunch = () => {
  return s().getData(LOCAL.firstLaunch);
};

export const setFirstLaunch = (mode: boolean) => {
  s().setData(LOCAL.firstLaunch, mode);
};

export const getCurrDomain = () => {
  return SERVER[getCurrServer()];
};

export const getDomain = (index: number) => {
  return SERVER[index];
};

export const getCurrPrefix = () => {
  let prefix: string = getCurrDomain();
  if (prefix === 'com') {
    prefix = 'na';
  }
  return prefix;
};

export const getPrefix = (index: number) => {
  let prefix: string = getDomain(index);
  if (prefix === 'com') {
    prefix = 'na';
  }
  return prefix;
};

export const getCurrServer = () => {
  return SafeValue(s().getData(LOCAL.userServer), 3);
};

export const setCurrServer = (index: number) => {
  s().setData(LOCAL.userServer, index);
};

/**
 * User Language
 */
export const getUserLang = () => {
  return SafeValue(s().getData(LOCAL.userLanguage), 'en');
};

export const setUserLang = (lang: string) => {
  s().setData(LOCAL.userLanguage, lang);
};

/**
 * API Language
 */
export const getAPILanguage = () => {
  return SafeValue(s().getData(LOCAL.apiLanguage), 'en');
};

export const getAPILangName = () => {
  return getAPIList()[getAPILanguage()];
};

export const langStr = () => {
  return `&language=${getAPILanguage()}`;
};

export const getAPIList = () => {
  return s().getData(SAVED.language);
};

export const setAPILanguage = (lang: string) => {
  s().setData(LOCAL.apiLanguage, lang);
};

/**
 * Swap Button
 */
export const getSwapButton = () => {
  return s().getData(LOCAL.swapButton);
};

export const setSwapButton = (swap: boolean) => {
  s().setSwapButton(swap);
  s().setData(LOCAL.swapButton, swap);
};

/**
 * Last Location
 */
export const setLastLocation = (str: string) => {
  s().setData(LOCAL.lastLocation, str);
  s().setLastLocation(str);
};

export const isProVersion = () => {
  return s().getData(LOCAL.proVersion) === true;
};

export const setProVersion = (pro: boolean) => {
  s().setData(LOCAL.proVersion, pro);
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
  return s().getData(LOCAL.date);
};

/**
 * get the date now and update saved date
 */
export const updateCurrData = () => {
  const today = new Date().toDateString();
  s().setData(LOCAL.date, today);
};

export const differentMonth = () => {
  const today = new Date();
  const curr = new Date(getCurrDate());
  const sameMonth = today.getMonth() === curr.getMonth();
  console.log('Same month - ' + sameMonth);
  return sameMonth;
};

export const getLastUpdate = () => {
  return s().getData(LOCAL.lastUpdate);
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
