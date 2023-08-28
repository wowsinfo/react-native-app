/**
 * InfoLabel.js
 *
 * A normal label with a caption on top
 */

import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Caption, Text} from 'react-native-paper';
import {Touchable} from './Touchable';

export interface InfoLabelProps {
  title: string,
  info: string,
  left?: boolean,
  right?: boolean,
  style?: any,
  onPress?: () => void,
}

export const InfoLabel = ({title, info, left, right, style, onPress}: InfoLabelProps) => {
  const {container} = styles;
  return (
    <Touchable
      fill
      style={[
        container,
        {alignItems: left ? 'flex-start' : right ? 'flex-end' : null},
      ]}
      onPress={onPress}>
      <Caption style={[{textAlign: 'center', marginBottom: -2}]}>
        {title}
      </Caption>
      <Text style={[{textAlign: 'center', marginBottom: 2}, style]}>
        {info}
      </Text>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
