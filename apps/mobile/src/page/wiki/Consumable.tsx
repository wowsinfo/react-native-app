import React, {useEffect, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {FlatGrid} from 'react-native-super-grid';
import {LoadingModal, WikiIcon, WoWsInfo} from '../../component';
import {SAVED, setLastLocation} from '../../value/data';
import {SafeAction} from '../../core';
import {useAppStore} from '../../store/useAppStore';

const Consumable = ({route}: any) => {
  const {upgrade} = route?.params ?? {};

  useEffect(() => {
    setLastLocation(upgrade === true ? 'Upgrade' : 'Consumable');
  }, [upgrade]);

  const consumable = useMemo(() => {
    let data: any[] = [];
    let saved = useAppStore.getState().getData(SAVED.consumable);
    for (let key in saved) {
      let curr = saved[key];
      if (upgrade && curr.type === 'Modernization') {
        data.push(curr);
      } else if (!upgrade && curr.type !== 'Modernization') {
        data.push(curr);
      }
    }
    data.sort((a, b) => {
      if (!upgrade) {
        if (a.type === 'Flags') return -1;
        return 1;
      }
      if (a.price_gold === 0) return a.price_credit - b.price_credit;
      return a.price_gold - b.price_gold;
    });
    return data;
  }, [upgrade]);

  if (!consumable) return <LoadingModal />;

  return (
    <WoWsInfo>
      <View style={{flex: 1}}>
        <FlatGrid
          itemDimension={80}
          data={consumable}
          renderItem={({item}) => (
            <WikiIcon
              item={item}
              onPress={() => SafeAction('BasicDetail', {item: item})}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </WoWsInfo>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export {Consumable};
