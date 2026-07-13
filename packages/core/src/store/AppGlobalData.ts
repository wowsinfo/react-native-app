class AppGlobalData {
  private static dataSource: any = {};
  static lightTheme: object = {};
  static darkTheme: object = {};
  static isDarkMode: boolean = false;
  static shouldSwapButton: boolean = false;
  static canCheckForUpdate: boolean = true;
  static shouldUpdateAPI: boolean = true;
  static realtimeBattleCount: number = 0;
  static lastLocation: string = "";
  static githubVersion: boolean = false;

  public static setupWith(data: any): void {
    if (data == null) {
      throw new Error(
        "The app cannot continue because there is a problem with the data.",
      );
    }
    AppGlobalData.dataSource = data;
  }

  public static get(key: string): any {
    return AppGlobalData.dataSource[key];
  }

  public static set(key: string, value: any): void {
    if (key == null || value == null) {
      console.error("AppGlobalData.set() cannot set null key or value");
      console.trace();
      return;
    }
    if (value instanceof Promise) {
      console.error("AppGlobalData.set() value is a Promise");
      console.trace();
      return;
    }
    AppGlobalData.dataSource[key] = value;
  }

  public static printDataSource(): void {
    console.log(AppGlobalData.dataSource);
  }
}

export default AppGlobalData;
