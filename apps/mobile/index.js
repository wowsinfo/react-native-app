import * as React from 'react';
import {AppRegistry} from 'react-native';
import App from './src/wowsinfo';
import {Provider as PaperProvider, MD3LightTheme} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import './src/value/global';

export function Main() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={MD3LightTheme}>
        <App />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent('wowsinfo', () => Main);
