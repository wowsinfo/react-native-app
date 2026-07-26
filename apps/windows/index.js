import * as React from 'react';
import {AppRegistry} from 'react-native';
import {enableScreens} from 'react-native-screens';
enableScreens(false);
import App from '../mobile/src/wowsinfo.tsx';
import {Provider as PaperProvider, MD3LightTheme} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import '../mobile/src/value/global.ts';

class ErrorBoundary extends React.Component {
  state = {error: null};
  componentDidCatch(error) {
    this.setState({error});
  }
  render() {
    return this.state.error ? null : this.props.children;
  }
}

export function Main() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={MD3LightTheme}>
          <App />
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

AppRegistry.registerComponent('wowsinfo', () => Main);
