import {SafeStorage, SafeValue} from '../core';
import {Actions} from 'react-native-router-flux';
import {getAvailablePurchases} from 'react-native-iap';
import {Alert, Platform} from 'react-native';
import {lang} from './lang';

/**
 * App information
 */
export const APP = {
  Version: '1.7.0',
  IOSVersion: '1.7.0',
  GameVersion: '12.7.0.0',
  Github: 'https://github.com/wowsinfo/react-native-app',
  AppStore: 'https://itunes.apple.com/app/id1202750166',
  GooglePlay:
    'https://play.google.com/store/apps/details?id=com.yihengquan.wowsinfo',
  Developer:
    'mailto:development.henryquan@gmail.com?subject=[WoWs Info 1.7.0] ',
  Patreon: 'https://www.patreon.com/henryquan',
  PayPal: 'https://www.paypal.me/YihengQuan',
  WeChat:
    'https://github.com/HenryQuan/WoWs-Info-Origin/blob/master/Support/WeChat.png',
  PersonalRating: 'https://wows-numbers.com/personal/rating',
  LatestRelease: 'https://github.com/wowsinfo/react-native-app/releases/latest',
};

/**
 * User perference
 */
export const LOCAL = {
  // ads: '@WoWs_Info:hasAds',
  friendList: '@WoWs_Info:playerList',
  userInfo: '@WoWs_Info:userInfo',
  userData: '@WoWs_Info:userData',
  userServer: '@WoWs_Info:currServer',
  appVersion: '@WoWs_Info:currVersion',
  gameVersion: '@WoWs_Info:gameVersion',
  date: '@WoWs_Info:currDate',
  // To do recent data for saved user only
  lastUpdate: '@WoWs_Info:lastUpdate',
  // data_saver: '@WoWs_Info:dataSaver',
  theme: '@WoWs_Info:themeColour',
  darkMode: '@WoWs_Info:darkMode',
  swapButton: '@WoWs_Info:swapButton',
  noImageMode: '@WoWs_Info:noImageMode',
  firstLaunch: '@WoWs_Info:firstLaunch',
  // Language
  apiLanguage: '@WoWs_Info:apiLanguage',
  userLanguage: '@WoWs_Info:userLanguage',
  // Save last visited location as a string
  lastLocation: '@WoWs_Info:lastLocation',
  // If user has purchased pro version
  proVersion: '@WoWs_Info:proVersion',
  // RS
  rsIP: '@WoWs_Info:rsIP',
  // Suport me
  showBanner: '@WoWs_Info:banner_ads',
  showFullscreen: '@WoWs_Info:fullscreen_ads',
};

/**
 * Cached data from Wargming server
 */
export const SAVED = {
  language: '@Data:language',
  encyclopedia: '@Data:encyclopedia',
  // shipType: '@Data:ship_type',
  achievement: '@Data:achievement',
  commanderSkill: '@Data:commander_skill',
  collection: '@Data:collection',
  // collectionItem: '@Data:collection_item',
  warship: '@Data:warship',
  map: '@Data:gameMap',
  consumable: '@Data:consumable',
  pr: '@Data:personal_rating',
};

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

/**
 * Server
 */
export const SERVER = ['ru', 'eu', 'com', 'asia'];

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
