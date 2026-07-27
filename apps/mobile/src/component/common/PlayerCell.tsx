import React from 'react';
import {StyleSheet} from 'react-native';
import {List, Caption, Text, useTheme} from 'react-native-paper';
import {SafeAction} from '../../core';

const PlayerCell = ({item, player, clan, width}: {item: Record<string, unknown>; player?: boolean; clan?: boolean; width?: number}) => {
  const theme = useTheme();
  const idColor = {color: theme.colors.onSurface};

  if (player) {
    return (
      <List.Item
        title={item.nickname}
        style={{width: width}}
        right={() => <Caption style={[styles.ID, idColor]}>{item.account_id}</Caption>}
        onPress={() => SafeAction('Statistics', {info: item})}
      />
    );
  } else if (clan) {
    return (
      <List.Item
        title={item.tag}
        style={{width: width}}
        right={() => <Caption style={[styles.ID, idColor]}>{item.clan_id}</Caption>}
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
