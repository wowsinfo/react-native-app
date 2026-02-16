/**
 * PlayerCell.tsx
 *
 * Display player and clan with their ID at the right
 */

import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {List, Caption, Text} from 'react-native-paper';
import {SafeAction} from '../../core';

interface PlayerItem {
  nickname: string;
  account_id: number;
}

interface ClanItem {
  tag: string;
  clan_id: number;
}

interface PlayerCellProps {
  item: PlayerItem | ClanItem;
  player?: boolean;
  clan?: boolean;
  width?: number;
}

class PlayerCell extends Component<PlayerCellProps> {
  render() {
    const {item, player, clan, width} = this.props;

    if (player) {
      const playerItem = item as PlayerItem;
      return (
        <List.Item
          title={playerItem.nickname}
          style={{width: width}}
          right={() => this.renderPlayerRight(playerItem.account_id)}
          onPress={() => this.pushPlayer(playerItem)}
        />
      );
    } else if (clan) {
      const clanItem = item as ClanItem;
      return (
        <List.Item
          title={clanItem.tag}
          style={{width: width}}
          right={() => this.renderClanRight(clanItem.clan_id)}
          onPress={() => this.pushClan(clanItem)}
        />
      );
    } else {
      return <Text>???</Text>;
    }
  }

  renderPlayerRight(account_id: number) {
    return <Caption style={styles.ID}>{account_id}</Caption>;
  }

  renderClanRight(clan_id: number) {
    return <Caption style={styles.ID}>{clan_id}</Caption>;
  }

  pushPlayer(item: PlayerItem) {
    SafeAction('Statistics', {info: item});
  }

  pushClan(item: ClanItem) {
    SafeAction('ClanInfo', {info: item});
  }
}

const styles = StyleSheet.create({
  ID: {
    alignSelf: 'center',
    marginRight: 8,
  },
});

export {PlayerCell};
