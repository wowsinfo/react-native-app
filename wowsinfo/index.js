import * as React from 'react';
import { AppRegistry } from 'react-native';
import App from './src/wowsinfo';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import './src/value/global';
import { NavigationContainer } from '@react-navigation/native';

// Provide ReadableStream for the ktor patch
import { ReadableStream as ReadableStreamPolyfill } from 'web-streams-polyfill';
// Hermes does not support TextDecoder yet 
// https://github.com/facebook/hermes/issues/1403
import { TextEncoder as TextDecoderPolyfill } from 'react-native-fast-encoder';

if (typeof window !== 'undefined') {
  window.ReadableStream = ReadableStreamPolyfill;
  // only need to provide the decoder
  window.TextDecoder = TextDecoderPolyfill;
}

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
