import React, {useMemo, useCallback} from 'react';
import {View, StyleSheet, LayoutChangeEvent} from 'react-native';
import {List, IconButton} from 'react-native-paper';
import {LOCAL} from '../../value/data';
import {SafeAction, SafeValue, bestWidth} from '../../core';
import {SectionTitle} from '../../component';
import {lang} from '../../value/lang';
import {useAppStore} from '../../store/useAppStore';

const Friend = () => {
  const friendList = useAppStore(s => s.data[LOCAL.friendList]);
  const [goodWidth, setGoodWidth] = React.useState(bestWidth(400));

  const player = useMemo(() => {
    if (!friendList?.player) return [];
    const list: any[] = [];
    for (const ID in friendList.player) list.push(friendList.player[ID]);
    return list;
  }, [friendList]);

  const clan = useMemo(() => {
    if (!friendList?.clan) return [];
    const list: any[] = [];
    for (const ID in friendList.clan) list.push(friendList.clan[ID]);
    return list;
  }, [friendList]);

  const updateBestWidth = useCallback((event: LayoutChangeEvent) => {
    const newWidth = event.nativeEvent.layout.width;
    setGoodWidth(bestWidth(400, newWidth));
  }, []);

  const removeFriend = useCallback((info: any) => {
    const str = LOCAL.friendList;
    const allData = JSON.parse(
      JSON.stringify(useAppStore.getState().getData(str)),
    );
    delete allData.player[info.account_id];
    useAppStore.getState().setData(str, allData);
  }, []);

  const removeClan = useCallback((info: any) => {
    const str = LOCAL.friendList;
    const allData = JSON.parse(
      JSON.stringify(useAppStore.getState().getData(str)),
    );
    delete allData.clan[info.clan_id];
    useAppStore.getState().setData(str, allData);
  }, []);

  const pushToPlayer = useCallback((info: any) => {
    SafeAction('Statistics', {info: info});
  }, []);

  const pushToClan = useCallback((info: any) => {
    SafeAction('ClanInfo', {info: info});
  }, []);

  return (
    <View onLayout={updateBestWidth}>
      <SectionTitle
        title={`${lang.friend_clan_title} - ${SafeValue(clan.length, 0)}`}
      />
      <View style={styles.wrap}>
        {clan.map(item => (
          <List.Item
            style={{width: goodWidth}}
            title={item.tag}
            onPress={() => pushToClan(item)}
            description={`${item.clan_id}`}
            key={String(item.clan_id)}
            right={() => (
              <IconButton
                iconColor={'#9E9E9E'}
                icon="close"
                onPress={() => removeClan(item)}
              />
            )}
          />
        ))}
      </View>
      <SectionTitle
        title={`${lang.friend_player_title} - ${SafeValue(player.length, 0)}`}
      />
      <View style={styles.wrap}>
        {player.map(item => (
          <List.Item
            style={{width: goodWidth}}
            title={item.nickname}
            onPress={() => pushToPlayer(item)}
            description={`${item.account_id}`}
            key={String(item.account_id)}
            right={() => (
              <IconButton
                iconColor={'#9E9E9E'}
                icon="close"
                onPress={() => removeFriend(item)}
              />
            )}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export {Friend};
