import {QuickAction} from './QuickAction';
import {NativeModules} from 'react-native';

const manager = NativeModules.ReactNativeManager;

export class ReactNativeManager {
  private static _instance: ReactNativeManager;
  private constructor() {}

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }

  // Keep the listener alive
  private quickActionManager!: QuickAction;

  setup() {
    this.quickActionManager = new QuickAction();
  }

  static appHasLoaded() {
    manager?.reactNativeHasLoaded?.();
  }
}
