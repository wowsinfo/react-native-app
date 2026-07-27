/**
 * SimpleRating.js
 *
 * Rating and class 3 icons
 */

import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Text} from 'react-native-paper';
import {getColour, roundTo} from '../../core';

interface SimpleRatingProps {
  info: {
    pvp: {battles: number; wins: number; damage_dealt: number} | null;
    rating?: number;
  };
}

export const SimpleRating = ({info}: SimpleRatingProps) => {
  const {centerText, horizontal, centerView} = styles;
  const {pvp, rating} = info;
  const ratingColour = getColour(rating);

  if (pvp == null || pvp.battles === 0) {
    return (
      <View>
        <View style={horizontal}>
          <View style={centerView}>
            <Image style={{height: 24, width: 24, tintColor: ratingColour}} source={{uri: 'Battle'}} />
            <Text style={centerText}>0</Text>
          </View>
          <View style={centerView}>
            <Image style={{height: 24, width: 24, tintColor: ratingColour}} source={{uri: 'WinRate'}} />
            <Text style={centerText}>0.0%</Text>
          </View>
          <View style={centerView}>
            <Image style={{height: 24, width: 24, tintColor: ratingColour}} source={{uri: 'Damage'}} />
            <Text style={centerText}>0</Text>
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
  }

  return (
    <View>
      <View style={horizontal}>
        <View style={centerView}>
          <Image style={{height: 24, width: 24, tintColor: ratingColour}} source={{uri: 'Battle'}} />
          <Text style={centerText}>{pvp.battles}</Text>
        </View>
        <View style={centerView}>
          <Image style={{height: 24, width: 24, tintColor: ratingColour}} source={{uri: 'WinRate'}} />
          <Text style={centerText}>{`${roundTo((pvp.wins / pvp.battles) * 100, 2)}%`}</Text>
        </View>
        <View style={centerView}>
          <Image style={{height: 24, width: 24, tintColor: ratingColour}} source={{uri: 'Damage'}} />
          <Text style={centerText}>{roundTo(pvp.damage_dealt / pvp.battles)}</Text>
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
