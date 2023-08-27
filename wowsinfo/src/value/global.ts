/**
 * This file contains all the global data that is used throughout the app.
 * This is an improvement over the previous version where we used a global.
 */
class AppGlobalData {
  // We store saved and local data as a single object
  private static dataSource: any = {};
  public static setupWith(data: any): void {
    if (data == null) {
      throw new Error(
        'The app cannot continue because there is a problem with the data. Please try again later.',
      );
    }

    AppGlobalData.dataSource = data;
  }

  public static get(key: string): any {
    return AppGlobalData.dataSource[key];
  }

  public static set(key: string, value: any): void {
    if (key == null || value == null) {
      console.error('AppGlobalData.set() cannot set null key or value');
      console.trace();
      return;
    }

    // if value is a Promise, we need to resolve it first
    if (value instanceof Promise) {
      console.error('AppGlobalData.set() value is a Promise');
      console.trace();
      return;
    }

    AppGlobalData.dataSource[key] = value;
  }

  public static printDataSource(): void {
    console.log(AppGlobalData.dataSource);
  }

  // Theme
  static lightTheme: object = {};
  static darkTheme: object = {};
  static isDarkMode: boolean = false;

  // App Settings
  static shouldSwapButton: boolean = false;
  static useNoImageMode: boolean = false;
  static useCleanMode: boolean = false; // not used

  // You can only check one time
  static canCheckForUpdate: boolean = true;
  // Only update api once as well
  static shouldUpdateAPI: boolean = true;

  // Trace how many battles
  static realtimeBattleCount: number = 0;

  // Trace last known location
  static lastLocation: string = '';

  static githubVersion: boolean = false;
}

const appGlobalData = AppGlobalData;
// @ts-ignore
window.AppGlobalData = appGlobalData;
