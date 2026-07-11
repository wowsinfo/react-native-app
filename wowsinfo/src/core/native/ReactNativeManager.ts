import {NativeEvents} from './NativeEvents';
import {QuickAction} from './QuickAction';

export class ReactNativeManager {
  private static _instance: ReactNativeManager;
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private quickActionManager!: QuickAction;
  private nativeEvents: NativeEvents = new NativeEvents();

  setup() {
    this.quickActionManager = new QuickAction();
  }
}
