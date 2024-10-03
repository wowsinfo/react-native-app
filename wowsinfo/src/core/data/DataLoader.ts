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

    let data: any = {};
    // Manully setting up SAVED section (they are all different)
    await this.loadEntry(data, apiLanguage, 'en');
    await this.loadEntry(data, userLanguage, lang.getLanguage());
    await this.loadEntry(data, swapButton, false);
    await this.loadEntry(data, appVersion, APP.Version);
    await this.loadEntry(data, gameVersion, APP.GameVersion);
    await this.loadEntry(data, firstLaunch, true);
    await this.loadEntry(data, rsIP, '');
    await this.loadEntry(data, lastLocation, '');
    await this.loadEntry(data, showBanner, true);
    await this.loadEntry(data, showFullscreen, false);
    // Not a pro version by default
    if (Platform.OS == 'macos') {
      await this.loadEntry(data, proVersion, true);
    }
    await this.loadEntry(data, proVersion, false);

    // Add support to save clans as well
    let list = {
      clan: {
        2000020641: {tag: 'ICBC', clan_id: '2000020641', server: 3},
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
    let friendInfo = data[friendList];
    if (friendInfo.player == null) {
      // Previously, it was all players
      let saved: any = {clan: {}, player: {}};
      friendInfo.forEach(
        (v: any) => (saved.player[v.id] = this.formatConverter(v)),
      );
      data[friendList] = saved;
      SafeStorage.set(friendList, saved);
    }

    // let's add ICBC if FFD is still present
    if (friendInfo.clan[2000008934] != null) {
      delete friendInfo.clan[2000008934];
      friendInfo.clan[2000020641] = {tag: 'ICBC', clan_id: '2000020641', server: 3};
      SafeStorage.set(friendList, friendInfo);
    }

    await this.loadEntry(data, userData, {});
    await this.loadEntry(data, userInfo, {
      nickname: '',
      account_id: '',
      server: 3,
    });
    let info = data[userInfo];
    if (info.nickname == null) {
      let formatted = this.formatConverter(info);
      data[userInfo] = formatted;
      SafeStorage.set(userInfo, formatted);
    }
    await this.loadEntry(data, userServer, 3);
    await this.loadEntry(data, lastUpdate, new Date().toDateString());
    await this.loadEntry(data, theme, RED);
    await this.loadEntry(data, darkMode, false);
    await this.loadEntry(data, date, new Date().toDateString());
    return data;
  }

  /**
   * Convert old format to new format
   * @param {*} obj
   */
  static formatConverter(obj: any) {
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
    let data: any = {};
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
  static async loadEntry(data: any, key: string, value: any) {
    data[key] = await SafeStorage.get(key, value);
  }
}

export {DataLoader};
