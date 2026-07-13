import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Surface} from 'react-native-paper';

const SafeView = ({style, children}: any) => {
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
