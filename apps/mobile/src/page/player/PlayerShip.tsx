import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {FlatList} from 'react-native';
import {
  WoWsInfo,
  WarshipCell,
  Touchable,
  RatingButton,
  FooterPlus,
  SimpleRating,
} from '../../component';
import {
  getOverallRating,
  SafeAction,
  filterShip,
  Guard,
  getColour,
  bestCellWidthEven,
} from '../../core';
import {FlatGrid} from 'react-native-super-grid';
import {SAVED} from '../../value/data';
import {lang} from '../../value/lang';
import {Button, useTheme} from 'react-native-paper';
import {getTintColour} from '../../value/colour';
import {useAppStore} from '../../store/useAppStore';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@wowsinfo/shared';

const PlayerShip = ({route}: NativeStackScreenProps<RootStackParamList, 'PlayerShip'>) => {
  const ships = route?.params?.data;
  const initialRating = route?.params?.rating;

  const original = useMemo(() => {
    if (!ships) return [];
    return [...ships].sort(
      (a: Record<string, unknown>, b: Record<string, unknown>) => (b.last_battle_time as number) - (a.last_battle_time as number),
    );
  }, [ships]);

  const initRating = useMemo(() => {
    if (!ships) return 0;
    return initialRating ?? getOverallRating(ships);
  }, [initialRating, ships]);

  const [data, setData] = useState(original);
  const [rating, setRating] = useState(initRating);
  const [filter, setFilter] = useState({});
  const [sortStr, setSortStr] = useState('');
  const theme = useTheme();

  useEffect(() => {
    return () => {
      theme.colors.primary = getTintColour()[500];
    };
  }, []);

  useEffect(() => {
    const {filter: f} = route?.params ?? {};
    if (f) {
      if (f === filter) {
        setRating(getOverallRating(data));
        return;
      }
      setFilter(f);
      const sorted = filterShip(f, original);
      if (sorted == null) {
        setData(original);
        setRating(initRating);
      } else {
        setData(sorted);
        setRating(getOverallRating(sorted));
      }
    }
  }, [route?.params?.filter]);

  const ratingColor = getColour(rating);
  theme.colors.primary = ratingColor;

  const updateShip = useCallback(
    (d: Record<string, unknown>) => {
      const sorted = filterShip(d, original);
      if (sorted == null) {
        setData(original);
        setRating(initRating);
      } else {
        const r = getOverallRating(sorted);
        setData(sorted);
        setRating(r);
      }
    },
    [original, initRating],
  );

  const sortData = useCallback(
    (v: string) => {
      setData(prev => {
        if (v === sortStr) {
          setSortStr('');
          return [...prev.reverse()];
        }
        setSortStr(v);
        return [
          ...prev.sort((a: Record<string, unknown>, b: Record<string, unknown>) => (Guard(b, v, 0) as number) - (Guard(a, v, 0) as number)),
        ];
      });
    },
    [sortStr],
  );

  const renderShip = useCallback((item: Record<string, unknown>) => {
    const ship = useAppStore.getState().getData(SAVED.warship)[item.ship_id];
    return (
      <Touchable
        key={item.ship_id}
        onPress={() => SafeAction('PlayerShipDetail', {data: item})}>
        <WarshipCell item={ship} scale={2} />
        <SimpleRating info={item} />
      </Touchable>
    );
  }, []);

  const sortingMethod = [
    {n: lang.ship_sort_battle, v: 'pvp.battles'},
    {n: lang.warship_avg_damage, v: 'avgDmg'},
    {n: lang.warship_avg_winrate, v: 'avgWinrate'},
    {n: lang.warship_avg_frag, v: 'avgFrags'},
    {n: lang.ship_sort_colour, v: 'rating'},
    {n: 'AP', v: 'ap'},
    {n: lang.basic_last_battle, v: 'last_battle_time'},
    {n: lang.record_max_damage_dealt, v: 'pvp.max_damage_dealt'},
    {n: lang.record_max_xp, v: 'pvp.max_xp'},
    {n: lang.record_max_frags_battle, v: 'pvp.max_frags_battle'},
  ];

  const cellWidth = bestCellWidthEven(160);

  return (
    <WoWsInfo
      hideAds
      title={`${lang.wiki_warship_footer} - ${data.length}`}
      onPress={() => SafeAction('WarshipFilter', {applyFunc: updateShip})}>
      <RatingButton rating={rating} />
      <FlatGrid
        itemDimension={cellWidth}
        spacing={0}
        data={data}
        keyExtractor={item => String(item.ship_id)}
        renderItem={({item}) => renderShip(item)}
        showsVerticalScrollIndicator={false}
      />
      <FooterPlus>
        <FlatList
          data={sortingMethod}
          renderItem={({item}) => (
            <Button
              style={{margin: 8}}
              mode="contained"
              onPress={() => sortData(item.v)}>
              {item.n}
            </Button>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={d => d.n}
        />
      </FooterPlus>
    </WoWsInfo>
  );
};

export default PlayerShip;
