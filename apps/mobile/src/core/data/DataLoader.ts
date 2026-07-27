/**
 * Load all saved data to global
 */
import {SafeStorage} from '../util/SafeStorage';
import {LOCAL, SAVED, APP} from '../../value/data';
// @ts-ignore
import {RED} from 'react-native-material-color';
import {lang} from '../../value/lang';
import {Platform} from 'react-native';

class DataLoader {
  /**
   * Load all data from storage
   * Return an object with all data
   */
  static async loadAll() {
    // For debugging only
    // SafeStorage.clear();

    let local = await this.loadLocal();
    let saved = await this.loadSaved();
    return Object.assign(local, saved);
  }

  /**
   * Load all local data, no Internet is required
   * @param {*} data
   */
  static async loadLocal() {
    const {
      apiLanguage,
      appVersion,
      gameVersion,
      firstLaunch,
      friendList,
      userData,
      showBanner,
      showFullscreen,
      userInfo,
      userServer,
      lastUpdate,
      theme,
      darkMode,
      date,
      swapButton,
      userLanguage,
      rsIP,
      lastLocation,
      proVersion,
    } = LOCAL;

    let data: Record<string, unknown> = {};
    // Manully setting up SAVED section (they are all different)
    this.loadEntry(data, apiLanguage, 'en');
    this.loadEntry(data, userLanguage, lang.getLanguage());
    this.loadEntry(data, swapButton, false);
    this.loadEntry(data, appVersion, APP.Version);
    this.loadEntry(data, gameVersion, APP.GameVersion);
    this.loadEntry(data, firstLaunch, true);
    this.loadEntry(data, rsIP, '');
    this.loadEntry(data, lastLocation, '');
    this.loadEntry(data, showBanner, true);
    this.loadEntry(data, showFullscreen, false);
    // Not a pro version by default
    if (Platform.OS == 'macos') {
      this.loadEntry(data, proVersion, true);
    }
    this.loadEntry(data, proVersion, false);

    // Add support to save clans as well
    let list = {
      clan: {
        2000022706: {tag: 'YU_RI', clan_id: '2000022706', server: 3},
      },
      player: {
        2011774448: {
          nickname: 'HenryQuan',
          account_id: '2011774448',
          server: 3,
        },
      },
    };

    await this.loadEntry(data, friendList, list);
    const friendInfo = data[friendList];
    if (friendInfo.player == null) {
      const saved: Record<string, unknown> = {clan: {}, player: {}};
      friendInfo.forEach(
        (v: Record<string, unknown>) => (saved.player[v.id as string] = this.formatConverter(v)),
      );
      data[friendList] = saved;
      SafeStorage.set(friendList, saved);
    }
    if (friendInfo.clan[2000008934] != null) {
      delete friendInfo.clan[2000008934];
      friendInfo.clan[2000020641] = {
        tag: 'ICBC',
        clan_id: '2000020641',
        server: 3,
      };
      SafeStorage.set(friendList, friendInfo);
    }

    this.loadEntry(data, userData, {});
    await this.loadEntry(data, userInfo, {
      nickname: '',
      account_id: '',
      server: 3,
    });
    const userInfoData = data[userInfo];
    if (userInfoData.nickname == null) {
      data[userInfo] = this.formatConverter(userInfoData);
      SafeStorage.set(userInfo, data[userInfo]);
    }
    this.loadEntry(data, userServer, 3);
    this.loadEntry(data, lastUpdate, new Date().toDateString());
    this.loadEntry(data, theme, RED);
    this.loadEntry(data, darkMode, false);
    this.loadEntry(data, date, new Date().toDateString());
    return data;
  }

  /**
   * Convert old format to new format
   * @param {*} obj
   */
  static formatConverter(obj: Record<string, unknown>) {
    if (obj.name != null) {
      obj.nickname = obj.name;
      delete obj.name;
    }

    if (obj.id != null) {
      obj.account_id = obj.id;
      delete obj.id;
    }

    return obj;
  }

  /**
   * Load all saved data, Internet connection is required
   * @param {*} data
   */
  static async loadSaved() {
    let data: Record<string, unknown> = {};
    // SAVED section is about the same
    for (let key in SAVED) {
      // @ts-ignore
      const curr = SAVED[key];
      // Get it from storage
      data[curr] = await SafeStorage.get(curr, {});
    }
    return data;
  }

  /**
   * Load and setup entries
   * @param {object} data
   * @param {string} key
   * @param {any} value
   */
  static async loadEntry(data: Record<string, unknown>, key: string, value: unknown) {
    data[key] = await SafeStorage.get(key, value);
  }
}

export {DataLoader};
