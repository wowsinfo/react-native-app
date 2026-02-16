/**
 * SafeView.tsx
 *
 * Wrap view around SafeAreView and Surface
 */

import React, {Component, ReactNode} from 'react';
import {SafeAreaView, StyleSheet, ViewStyle} from 'react-native';
import {Surface} from 'react-native-paper';

interface SafeViewProps {
  theme?: any;
  style?: ViewStyle;
  children?: ReactNode;
}

class SafeView extends Component<SafeViewProps> {
  render() {
    const {theme, style, children} = this.props;
    return (
      <Surface theme={theme} style={[style, styles.container]}>
        <SafeAreaView style={styles.container}>{children}</SafeAreaView>
      </Surface>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export {SafeView};
