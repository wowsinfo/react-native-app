import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  data: Record<string, any>;

  isDarkMode: boolean;
  shouldSwapButton: boolean;
  shouldUpdateAPI: boolean;
  canCheckForUpdate: boolean;
  lastLocation: string;
  githubVersion: boolean;
  realtimeBattleCount: number;
  lightTheme: Record<string, any>;
  darkTheme: Record<string, any>;

  hydrate: (initial: Record<string, any>) => void;
  setData: (key: string, value: unknown) => void;
  getData: (key: string) => any;
  setDarkMode: (val: boolean) => void;
  setSwapButton: (val: boolean) => void;
  setLastLocation: (val: string) => void;
  setTheme: (light: Record<string, unknown>, dark: Record<string, unknown>) => void;
  setShouldUpdateAPI: (val: boolean) => void;
  setGithubVersion: (val: boolean) => void;
  setRealtimeBattleCount: (val: number) => void;
  setCanCheckForUpdate: (val: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      data: {},
      isDarkMode: false,
      shouldSwapButton: false,
      shouldUpdateAPI: true,
      canCheckForUpdate: true,
      lastLocation: '',
      githubVersion: false,
      realtimeBattleCount: 0,
      lightTheme: {},
      darkTheme: {},

      hydrate: initial => set(s => ({data: {...initial, ...s.data}})),
      setData: (key, value) => set(s => ({data: {...s.data, [key]: value}})),
      getData: key => get().data[key],

      setDarkMode: val => set({isDarkMode: val}),
      setSwapButton: val => set({shouldSwapButton: val}),
      setLastLocation: val => set({lastLocation: val}),
      setTheme: (light, dark) => set({lightTheme: light, darkTheme: dark}),
      setShouldUpdateAPI: val => set({shouldUpdateAPI: val}),
      setGithubVersion: val => set({githubVersion: val}),
      setRealtimeBattleCount: val => set({realtimeBattleCount: val}),
      setCanCheckForUpdate: val => set({canCheckForUpdate: val}),
    }),
    {
      name: 'wowsinfo-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        data: state.data,
        isDarkMode: state.isDarkMode,
        shouldSwapButton: state.shouldSwapButton,
        shouldUpdateAPI: state.shouldUpdateAPI,
        canCheckForUpdate: state.canCheckForUpdate,
        lastLocation: state.lastLocation,
        githubVersion: state.githubVersion,
        realtimeBattleCount: state.realtimeBattleCount,
      }),
    },
  ),
);
