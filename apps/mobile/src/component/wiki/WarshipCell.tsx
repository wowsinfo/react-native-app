/**
 * WarshipCell.js
 *
 * It is a cell with a WikiIcon and a WarshipLabel below it
 */

import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {WikiIcon, WarshipLabel} from '..';
import {Touchable} from '../common/Touchable';
import {TintColour} from '../../value/colour';

export interface WarshipCellProps {
  item: any;
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
            tintColor: TintColour()[500],
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
