import * as React from 'react';
import {AppRegistry, NativeModules} from 'react-native';
import App from './src/wowsinfo';
import {Provider as PaperProvider, MD2LightTheme} from 'react-native-paper';
import './src/value/global';

if (__DEV__) {
  NativeModules.DevSettings.setIsDebuggingRemotely(true);
}

export function Main() {
  return (
    <PaperProvider theme={MD2LightTheme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent('wowsinfo', () => Main);
