import * as React from 'react';
import {AppRegistry} from 'react-native';
import App from './src/wowsinfo';
import {Provider as PaperProvider, MD2LightTheme} from 'react-native-paper';
import './src/value/global';

export function Main() {
  return (
    <PaperProvider theme={MD2LightTheme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent('wowsinfo', () => Main);
