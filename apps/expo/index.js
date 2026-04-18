import * as React from 'react';
import {AppRegistry, NativeModules} from 'react-native';
import App from './src/wowsinfo';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import './src/value/global';

if (__DEV__) {
  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

export function Main() {
  return (
    <PaperProvider theme={DefaultTheme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent('wowsinfo', () => Main);
