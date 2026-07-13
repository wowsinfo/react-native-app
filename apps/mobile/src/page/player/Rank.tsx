import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {WoWsInfo, Touchable, Info6Icon} from '../../component';
import {lang} from '../../value/lang';
import {FlatGrid} from 'react-native-super-grid';
import {Headline} from 'react-native-paper';
import {SafeAction} from '../../core';

const renderSeasonInfo = (data: any) => {
  if (data == null) return null;
  const rank_key = Object.keys(data).find(key => key != 'season');
  if (rank_key == null) return null;
  const {rank_solo, rank_div2, rank_div3} = data[rank_key];
  let info = rank_solo || rank_div2 || rank_div3;
  if (info == null) return null;
  return <Info6Icon data={info} compact />;
};

const Rank = ({route}: any) => {
  const {data: list, ship} = useMemo(() => {
    let l: any[] = [];
    for (let key in (route?.params?.data ?? {})) {
      let curr = route?.params?.data[key];
      curr.season = Number(key);
      l.push(curr);
    }
    l.reverse();
    return {data: l, ship: route?.params?.ship};
  }, [route?.params?.data, route?.params?.ship]);

  if (list == null || list.length == 0) return null;

  return (
    <WoWsInfo title={`${lang.tab_rank_title} - ${list.length}`}>
      <FlatGrid
        itemDimension={300}
        data={list}
        renderItem={({item}) => {
          const {season} = item;
          const shipData = ship[season];
          return (
            <Touchable
              onPress={
                shipData == null || shipData.length == 0
                  ? null
                  : () => SafeAction('PlayerShip', {data: shipData})
              }
              style={{margin: 8}}>
              <Headline style={styles.centerText}>
                {`- ${lang.rank_season_title} ${season} -`}
              </Headline>
              <View>{renderSeasonInfo(item)}</View>
            </Touchable>
          );
        }}
        spacing={0}
      />
    </WoWsInfo>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  centerText: {
    alignSelf: 'center',
    textAlign: 'center',
  },
});

export {Rank};
