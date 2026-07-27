/**
 * WarshipCell.js
 *
 * It is a cell with a WikiIcon and a WarshipLabel below it
 */

import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {WikiIcon, WarshipLabel} from '..';
import {Touchable} from '../common/Touchable';
import {getTintColour} from '../../value/colour';

export interface WarshipCellProps {
  item: Record<string, unknown>;
  scale?: number;
  onPress?: () => void;
}

export const WarshipCell = ({item, scale, onPress}: WarshipCellProps) => {
  const {container} = styles;

  let width = 80;
  if (scale) {
    width *= scale;
  }

  return (
    <Touchable style={container} onPress={item ? onPress : undefined}>
      {item ? (
        <WikiIcon warship item={item} scale={scale} />
      ) : (
        <Image
          style={{
            height: width / 1.7,
            width: width,
            tintColor: getTintColour()[500],
          }}
          source={{uri: 'Unknown'}}
        />
      )}
      <WarshipLabel item={item} />
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
