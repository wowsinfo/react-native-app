import React from 'react';
import {SafeAreaView, StyleSheet, ViewStyle} from 'react-native';
import {Surface} from 'react-native-paper';

const SafeView = ({style, children}: {style?: ViewStyle; children?: React.ReactNode}) => {
  return (
    <Surface style={[style, styles.container]}>
      <SafeAreaView style={styles.container}>{children}</SafeAreaView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export {SafeView};
