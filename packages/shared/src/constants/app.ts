export const APP = {
  Version: "1.7.7",
  IOSVersion: "1.7.7",
  GameVersion: "12.7.0.0",
  Github: "https://github.com/wowsinfo/react-native-app",
  AppStore: "https://apps.apple.com/app/id1202750166",
  GooglePlay:
    "https://play.google.com/store/apps/details?id=com.yihengquan.wowsinfo",
  Developer:
    "mailto:development.henryquan@gmail.com?subject=[WoWs Info 1.7.0] ",
  Patreon: "https://www.patreon.com/henryquan",
  PayPal: "https://www.paypal.me/YihengQuan",
  WeChat:
    "https://github.com/HenryQuan/WoWs-Info-Origin/blob/master/Support/WeChat.png",
  PersonalRating: "https://wows-numbers.com/personal/rating",
  LatestRelease: "https://github.com/wowsinfo/react-native-app/releases/latest",
};

export const LOCAL = {
  friendList: "@WoWs_Info:playerList",
  userInfo: "@WoWs_Info:userInfo",
  userData: "@WoWs_Info:userData",
  userServer: "@WoWs_Info:currServer",
  appVersion: "@WoWs_Info:currVersion",
  gameVersion: "@WoWs_Info:gameVersion",
  date: "@WoWs_Info:currDate",
  lastUpdate: "@WoWs_Info:lastUpdate",
  theme: "@WoWs_Info:themeColour",
  darkMode: "@WoWs_Info:darkMode",
  swapButton: "@WoWs_Info:swapButton",
  noImageMode: "@WoWs_Info:noImageMode",
  firstLaunch: "@WoWs_Info:firstLaunch",
  apiLanguage: "@WoWs_Info:apiLanguage",
  userLanguage: "@WoWs_Info:userLanguage",
  lastLocation: "@WoWs_Info:lastLocation",
  proVersion: "@WoWs_Info:proVersion",
  rsIP: "@WoWs_Info:rsIP",
  showBanner: "@WoWs_Info:banner_ads",
  showFullscreen: "@WoWs_Info:fullscreen_ads",
};

export const SAVED = {
  language: "@Data:language",
  encyclopedia: "@Data:encyclopedia",
  achievement: "@Data:achievement",
  commanderSkill: "@Data:commander_skill",
  collection: "@Data:collection",
  warship: "@Data:warship",
  map: "@Data:gameMap",
  consumable: "@Data:consumable",
  pr: "@Data:personal_rating",
};

export const SERVER = ["ru", "eu", "com", "asia"] as const;

export type ServerRegion = (typeof SERVER)[number];
