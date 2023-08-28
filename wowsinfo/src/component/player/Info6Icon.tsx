/**
 * Info6Icon.js
 *
 * The classic 6 icons
 */

import React, {useEffect, useState} from 'react';
import {View, StyleSheet, LayoutChangeEvent} from 'react-native';
import {IconLabel} from './IconLabel';
import {roundTo, bestWidth} from '../../core';

export interface Info6IconProps {
  data?: any;
  compact?: boolean;
  topOnly?: boolean;
}

export const Info6Icon = ({data, compact, topOnly}: Info6IconProps) => {
  // What is going on here?
  const [cellWidth, setCellWidth] = useState(bestWidth(100));
  const [bestItemWidth, setBestItemWidth] = useState<number | null>(null);

  const updateBestWidth = (event: LayoutChangeEvent) => {
    const goodWidth = event.nativeEvent.layout.width;
    setBestItemWidth(bestWidth(400, goodWidth));
  };

  if (!data) {
    return null;
  }

  const {
    battles,
    wins,
    damage_dealt,
    frags,
    xp,
    survived_battles,
    main_battery,
  } = data;

  const {hits, shots} = main_battery;
  const death = battles - survived_battles;

  const labelStyle = {width: cellWidth};

  return (
    <View
      style={[
        styles.wrap,
        compact
          ? {marginTop: 0, marginBottom: 0}
          : {marginTop: 16, marginBottom: 16},
      ]}
      onLayout={updateBestWidth}>
      <IconLabel icon={{uri: 'Battle'}} info={battles} style={labelStyle} />
      <IconLabel
        icon={{uri: 'WinRate'}}
        info={`${roundTo((wins / battles) * 100, 2)}%`}
        style={labelStyle}
      />
      <IconLabel
        icon={{uri: 'Damage'}}
        info={roundTo(damage_dealt / battles)}
        style={labelStyle}
      />
      {topOnly ? null : (
        <>
          <IconLabel
            icon={{uri: 'EXP'}}
            info={roundTo(xp / battles)}
            style={labelStyle}
          />
          <IconLabel
            icon={{uri: 'KillDeathRatio'}}
            info={roundTo(frags / death, 2)}
            style={labelStyle}
          />
          <IconLabel
            icon={{uri: 'HitRatio'}}
            info={`${roundTo((hits / shots) * 100, 2)}%`}
            style={labelStyle}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
