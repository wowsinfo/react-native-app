declare module "react-native-material-color";
declare module "react-native-keep-awake";
declare module "native-chart-experiment";
declare module "react-native-device-detection" {
  export const isAndroid: boolean;
  export const isIos: boolean;
  export const isTablet: boolean;
}
declare module "@jest/globals" {
  export const describe: (name: string, fn: () => void) => void;
  export const it: (name: string, fn: () => void) => void;
  export const expect: (value: unknown) => any;
}
declare module "../App" {
  const App: React.ComponentType;
  export default App;
}
