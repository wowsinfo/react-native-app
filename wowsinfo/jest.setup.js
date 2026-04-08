const React = require('react');
const {NativeModules} = require('react-native');

const passthrough = ({children}) => children ?? null;

jest.mock('react-native-router-flux', () => ({
  Router: passthrough,
  Stack: passthrough,
  Scene: () => null,
  Actions: {
    push: jest.fn(),
    pop: jest.fn(),
    refresh: jest.fn(),
    ProVersion: jest.fn(),
    state: {
      routes: [{routeName: 'Menu'}],
    },
  },
}));

jest.mock('react-native-localization', () => {
  return class LocalizedStrings {
    constructor(strings) {
      this._strings = strings;
      this.setLanguage('en');
    }

    setLanguage(language) {
      const nextLanguage = this._strings[language] ? language : 'en';
      this.language = nextLanguage;
      Object.assign(this, this._strings[nextLanguage]);
    }

    getLanguage() {
      return this.language;
    }
  };
});

jest.mock('react-native-iap', () => ({
  initConnection: jest.fn(() => Promise.resolve(true)),
  getSubscriptions: jest.fn(() => Promise.resolve([])),
  requestSubscription: jest.fn(() => Promise.resolve()),
  finishTransaction: jest.fn(() => Promise.resolve()),
  purchaseUpdatedListener: jest.fn(() => ({remove: jest.fn()})),
  purchaseErrorListener: jest.fn(() => ({remove: jest.fn()})),
  getAvailablePurchases: jest.fn(() => Promise.resolve([])),
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map();

  return {
    getItem: jest.fn(key => Promise.resolve(store.get(key) ?? null)),
    setItem: jest.fn((key, value) => {
      store.set(key, value);
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      store.clear();
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => Promise.resolve(Array.from(store.keys()))),
    multiGet: jest.fn(keys =>
      Promise.resolve(keys.map(key => [key, store.get(key) ?? null])),
    ),
  };
});

jest.mock('react-native-keep-awake', () => ({
  activate: jest.fn(),
  deactivate: jest.fn(),
}));

jest.mock('react-native-device-detection', () => ({
  __esModule: true,
  default: false,
  isAndroid: false,
  isIos: true,
  isTablet: false,
}));

jest.mock('react-native-exception-handler', () => ({
  setJSExceptionHandler: jest.fn(),
  setNativeExceptionHandler: jest.fn(),
}));

jest.mock('native-chart-experiment', () => ({
  BarChart: () => null,
  PieChart: () => null,
  HorizontalBarChart: () => null,
}));

const createEventModule = () => ({
  addListener: jest.fn(),
  removeListeners: jest.fn(),
});

NativeModules.DevSettings = {
  ...(NativeModules.DevSettings || {}),
  setIsDebuggingRemotely: jest.fn(),
};

NativeModules.ReactNativeEvent = createEventModule();
NativeModules.QuickActionEventEmitter = createEventModule();
NativeModules.QuickActionManager = {
  addMainAccount: jest.fn(),
  performPendingShortcut: jest.fn(),
};
NativeModules.ReactNativeManager = {
  reactNativeHasLoaded: jest.fn(),
};
NativeModules.SimpleViewHandler = {
  showSafariViewController: jest.fn(() => Promise.resolve(false)),
};
