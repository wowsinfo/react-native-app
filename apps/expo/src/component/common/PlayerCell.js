/**
 * PlayerCell.js
 *
 * Dsiplay player and clan with her ID at the right
 */

import React, {Component} from 'react';
import {List, Caption, Text} from 'react-native-paper';
import {SafeAction} from '../../core';

class PlayerCell extends Component {
  render() {
    const {item, player, clan, width} = this.props;

    if (player) {
      return (
        <List.Item
          title={item.nickname}
          style={{width: width}}
          right={() => this.renderPlayerRight(item.account_id)}
          onPress={() => this.pushPlayer(item)}
        />
      );
    } else if (clan) {
      return (
        <List.Item
          title={item.tag}
          style={{width: width}}
          right={() => this.renderClanRight(item.clan_id)}
          onPress={() => this.pushClan(item)}
        />
      );
    } else {
      return <Text>???</Text>;
    }
  }

  renderPlayerRight(account_id) {
    return <Caption style={{alignSelf: 'center', marginRight: 8}}>{account_id}</Caption>;
  }

  renderClanRight(clan_id) {
    return <Caption style={{alignSelf: 'center', marginRight: 8}}>{clan_id}</Caption>;
  }

  pushPlayer(item) {
    SafeAction('Statistics', {info: item});
  }

  pushClan(item) {
    SafeAction('ClanInfo', {info: item});
  }
}

export {PlayerCell};
