import React from 'react';
import {StyleSheet} from 'react-native';
import {Divider} from 'react-native-paper';

export const DividerPlus = () => {
  const {divider} = styles;
  return <Divider style={divider} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 8,
  },
});
