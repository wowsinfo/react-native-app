import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {
  WoWsInfo,
  WarshipCell,
  InfoLabel,
  DetailedInfo,
  RatingButton,
} from '../../component';
import {SAVED} from '../../value/data';
import {Actions} from '../../core/navigation/Actions';
import {SafeAction, getColour, roundTo} from '../../core';
import {lang} from '../../value/lang';
import {useTheme} from 'react-native-paper';
import {getTintColour} from '../../value/colour';
import {useAppStore} from '../../store/useAppStore';

const getColor = (diff: string | number) => {
  const n = typeof diff === "string" ? Number(diff) : diff;
  if (n === 0) return null;
  return {color: n > 0 ? "green" : "red"};
};

const normalise = (diff: number, digit: number) => {
  let rounded = roundTo(diff, digit);
  if (rounded <= 0) return rounded;
  return `+${rounded}`;
};

const renderNumberDiff = (data: Record<string, unknown>, overall: Record<string, unknown>) => {
  if (overall == null || data == null) return null;
  const {battles, wins, damage_dealt, frags} = data;
  const {average_damage_dealt, average_frags, win_rate} = overall;

  let dmgDiff = normalise(damage_dealt / battles - average_damage_dealt, 0);
  let winrateDiff = normalise((wins / battles) * 100 - win_rate, 2);
  let fragDiff = normalise(frags / battles - average_frags, 2);

  return (
    <View style={styles.horizontal}>
      <InfoLabel
        style={getColor(dmgDiff)}
        info={dmgDiff}
        title={lang.ship_detail_damage}
      />
      <InfoLabel
        style={getColor(winrateDiff)}
        info={`${winrateDiff}%`}
        title={lang.ship_detail_winrate}
      />
      <InfoLabel
        style={getColor(fragDiff)}
        info={fragDiff}
        title={lang.ship_detail_frag}
      />
    </View>
  );
};

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@wowsinfo/shared';

const Detailed = ({route}: NativeStackScreenProps<RootStackParamList, 'PlayerShipDetail'>) => {
  const [data] = useState(route?.params?.data);
  const theme = useTheme();
  const store = useAppStore.getState();

  useEffect(() => {
    return () => {
      theme.colors.primary = getTintColour()[500];
    };
  }, []);

  if (data == null) {
    Actions.pop();
    return null;
  }

  const {pvp, ship_id, rating} = data;
  const ship = store.getData(SAVED.warship)[ship_id];
  const overall = store.getData(SAVED.pr)[ship_id];
  theme.colors.primary = getColour(rating);

  return (
    <WoWsInfo
      onPress={
        ship == null ? undefined : () => SafeAction('WarshipDetail', {item: ship})
      }
      title={lang.wiki_section_title}>
      <RatingButton rating={rating} />
      <ScrollView
        contentContainerStyle={{paddingBottom: 16, paddingTop: 16}}
        showsVerticalScrollIndicator={false}>
        <WarshipCell item={ship} scale={3} />
        {renderNumberDiff(pvp, overall)}
        <DetailedInfo data={data} />
      </ScrollView>
    </WoWsInfo>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default Detailed;
