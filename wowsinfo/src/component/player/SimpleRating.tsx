/**
 * SimpleRating.js
 *
 * Rating and class 3 icons
 */

import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Text} from 'react-native-paper';
import {getColour, roundTo} from '../../core';

export const SimpleRating = ({info}: any) => {
  const {centerText, horizontal, centerView} = styles;
  const {pvp, rating} = info;
  const ratingColour = getColour(rating);

  let nothing = false;
  if (pvp == null) {
    nothing = true;
  } else if (pvp.battles === 0) {
    nothing = true;
  }

  let iconStyle = {height: 24, width: 24, tintColor: ratingColour};
  return (
    <View>
      <View style={horizontal}>
        <View style={centerView}>
          <Image style={iconStyle} source={{uri: 'Battle'}} />
          <Text style={centerText}>{nothing ? '0' : pvp.battles}</Text>
        </View>
        <View style={centerView}>
          <Image style={iconStyle} source={{uri: 'WinRate'}} />
          <Text style={centerText}>
            {nothing
              ? '0.0%'
              : `${roundTo((pvp.wins / pvp.battles) * 100, 2)}%`}
          </Text>
        </View>
        <View style={centerView}>
          <Image style={iconStyle} source={{uri: 'Damage'}} />
          <Text style={centerText}>
            {nothing ? '0' : roundTo(pvp.damage_dealt / pvp.battles)}
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: ratingColour,
          height: 12,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  centerText: {
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: '300',
  },
  centerView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
