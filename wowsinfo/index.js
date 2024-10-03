import * as React from 'react';
import { AppRegistry } from 'react-native';
import App from './src/wowsinfo';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import './src/value/global';
import { NavigationContainer } from '@react-navigation/native';

export function Main() {
  return (
    <PaperProvider theme={DefaultTheme}>
      <NavigationContainer>
        <App />
      </NavigationContainer>
    </PaperProvider>
  );
}

AppRegistry.registerComponent('wowsinfo', () => Main);
