import React, {useEffect, useMemo} from 'react';
import {FlatGrid} from 'react-native-super-grid';
import {WikiIcon, WoWsInfo} from '../../component';
import {SAVED, setLastLocation} from '../../value/data';
import {SafeAction} from '../../core';
import {useAppStore} from '../../store/useAppStore';

const Achievement = () => {
  useEffect(() => {
    setLastLocation('Achievement');
    console.log('WIKI - Achievement');
  }, []);

  const data = useMemo(() => {
    const achievement: Record<string, {hidden: number}> = useAppStore.getState().getData(SAVED.achievement);
    let sorted = Object.entries(achievement).sort((a, b) => {
      if (a[1].hidden === b[1].hidden) {
        return a[0].localeCompare(b[0]);
      }
      return a[1].hidden - b[1].hidden;
    });
    sorted.forEach((_, index) => {
      sorted[index] = Object.assign(sorted[index][1]);
    });
    return sorted;
  }, []);

  return (
    <WoWsInfo>
      <FlatGrid
        itemDimension={80}
        data={data}
        renderItem={({item}) => (
          <WikiIcon
            item={item}
            onPress={() => SafeAction('BasicDetail', {item: item})}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </WoWsInfo>
  );
};

export {Achievement};
