import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {SAVED} from '../../value/data';
import {WoWsInfo, WikiIcon, Touchable} from '../../component';
import {FlatGrid} from 'react-native-super-grid';
import {Paragraph} from 'react-native-paper';
import {SafeAction} from '../../core';
import {lang} from '../../value/lang';
import {useAppStore} from '../../store/useAppStore';

interface PlayerAchievementProps {
  route: {params?: {data?: Record<string, number>}};
}

export const PlayerAchievement = ({route}: PlayerAchievementProps) => {
  const {data} = route?.params ?? {};
  const [displayData, setDisplayData] = useState<Array<any>>([]);

  useEffect(() => {
    if (!data) return;
    let saved = useAppStore.getState().getData(SAVED.achievement);

    let formatted = [];
    for (let key in data) {
      let obj = saved?.[key];
      if (obj != null) {
        formatted.push({data: obj, num: data[key]});
      }
    }

    formatted.sort((a, b) => b.num - a.num);
    setDisplayData(formatted);
  }, [data]);

  return (
    <WoWsInfo title={`${lang.tab_achievement_title} - ${displayData.length}`}>
      <FlatGrid
        itemDimension={80}
        data={displayData}
        renderItem={({item}) => {
          return (
            <Touchable
              onPress={() => SafeAction('BasicDetail', {item: item.data})}>
              <WikiIcon item={item.data} />
              <Paragraph style={styles.number}>{item.num}</Paragraph>
            </Touchable>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </WoWsInfo>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    textAlign: 'center',
  },
});
