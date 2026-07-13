import React from 'react';
import {StyleSheet} from 'react-native';
import {List, Caption, Text} from 'react-native-paper';
import {SafeAction} from '../../core';

const renderPlayerRight = (account_id: string) => (
  <Caption style={styles.ID}>{account_id}</Caption>
);

const renderClanRight = (clan_id: string) => (
  <Caption style={styles.ID}>{clan_id}</Caption>
);

const PlayerCell = ({item, player, clan, width}: any) => {
  if (player) {
    return (
      <List.Item
        title={item.nickname}
        style={{width: width}}
        right={() => renderPlayerRight(item.account_id)}
        onPress={() => SafeAction('Statistics', {info: item})}
      />
    );
  } else if (clan) {
    return (
      <List.Item
        title={item.tag}
        style={{width: width}}
        right={() => renderClanRight(item.clan_id)}
        onPress={() => SafeAction('ClanInfo', {info: item})}
      />
    );
  } else {
    return <Text>???</Text>;
  }
};

const styles = StyleSheet.create({
  ID: {
    alignSelf: 'center',
    marginRight: 8,
  },
});

export {PlayerCell};
