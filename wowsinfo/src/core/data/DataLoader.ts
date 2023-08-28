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
      noImageMode,
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

    this.loadEntry(data, friendList, list).then(() => {
      let info = data[friendList];
      if (info.player == null) {
        // Previously, it was all players
        let saved: any = {clan: {}, player: {}};
        info.forEach(
          (v: any) => (saved.player[v.id] = this.formatConverter(v)),
        );
        data[friendList] = saved;
        SafeStorage.set(friendList, saved);
      }

      // let's add ICBC if FFD is still present
      if (info.clan[2000008934] != null) {
        delete info.clan[2000008934];
        info.clan[2000020641] = {tag: 'ICBC', clan_id: '2000020641', server: 3};
        SafeStorage.set(friendList, info);
      }
    });

    this.loadEntry(data, userData, {});
    this.loadEntry(data, userInfo, {
      nickname: '',
      account_id: '',
      server: 3,
    }).then(() => {
      // Update format
      let info = data[userInfo];
      if (info.nickname == null) {
        let formatted = this.formatConverter(info);
        data[userInfo] = formatted;
        SafeStorage.set(userInfo, formatted);
      }
    });
    this.loadEntry(data, userServer, 3);
    this.loadEntry(data, lastUpdate, new Date().toDateString());
    this.loadEntry(data, theme, RED);
    this.loadEntry(data, darkMode, false);
    this.loadEntry(data, noImageMode, false);
    this.loadEntry(data, date, new Date().toDateString());
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
