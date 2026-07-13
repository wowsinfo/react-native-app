import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {WoWsInfo, WarshipCell} from '../../component';
import {FlatGrid} from 'react-native-super-grid';
import {SAVED, setLastLocation} from '../../value/data';
import {lang} from '../../value/lang';
import {
  SafeAction,
  filterShip,
  bestCellWidthEven,
} from '../../core';
import {useAppStore} from '../../store/useAppStore';

const Warship = ({route}: any) => {
  useEffect(() => {
    setLastLocation('Warship');
    console.log('WIKI - Warship');
  }, []);

  const original = useMemo(() => {
    let warship = useAppStore.getState().getData(SAVED.warship);
    let sorted: any[] = Object.entries(warship).sort((a: any, b: any) => {
      if (a[1].new) return -1;
      if (b[1].new) return 1;
      if (a[1].tier === b[1].tier) {
        return a[1].type.localeCompare(b[1].type);
      }
      return b[1].tier - a[1].tier;
    });
    sorted.forEach((s, i) => (sorted[i] = Object.assign(s[1])));
    return sorted;
  }, []);

  const [data, setData] = useState(original);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    const {filter: f} = route?.params ?? {};
    if (f) {
      if (f === filter) return;
      setFilter(f);
      const sorted = filterShip(f);
      if (sorted == null) {
        setData(original);
      } else {
        setData(sorted);
      }
    }
  }, [route?.params?.filter]);

  const updateShip = useCallback((d: any) => {
    const sorted = filterShip(d);
    if (sorted == null) {
      setData(original);
    } else {
      setData(sorted);
    }
  }, [original]);

  const width = bestCellWidthEven(160);
  return (
    <WoWsInfo
      title={`${lang.wiki_warship_footer} - ${data.length}`}
      onPress={() =>
        SafeAction('WarshipFilter', {applyFunc: updateShip})
      }>
      <FlatGrid
        itemDimension={width}
        spacing={0}
        data={data}
        keyExtractor={item => String(item.ship_id)}
        renderItem={({item}) => (
          <WarshipCell
            scale={width / 80}
            item={item}
            onPress={() => SafeAction('WarshipDetail', {item: item})}
          />
        )}
        showsVerticalScrollIndicator={false}
        fixed
      />
    </WoWsInfo>
  );
};

export {Warship};
