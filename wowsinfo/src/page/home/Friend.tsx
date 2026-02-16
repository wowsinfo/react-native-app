import React, {PureComponent} from 'react';
import {View, StyleSheet, LayoutChangeEvent} from 'react-native';
import {List, Colors, IconButton} from 'react-native-paper';
import {LOCAL} from '../../value/data';
import {SafeAction, SafeStorage, SafeValue, bestWidth} from '../../core';
import {SectionTitle} from '../../component';
import {lang} from '../../value/lang';

interface PlayerItem {
  account_id: number;
  nickname: string;
  server: number;
}

interface ClanItem {
  clan_id: number;
  tag: string;
  server: number;
}

interface FriendList {
  player: Record<string, PlayerItem>;
  clan: Record<string, ClanItem>;
}

interface FriendProps {}

interface FriendState {
  player: PlayerItem[];
  clan: ClanItem[];
  goodWidth: number;
}

class Friend extends PureComponent<FriendProps, FriendState> {
  constructor(props: FriendProps) {
    super(props);
    let all: FriendList = AppGlobalData.get(LOCAL.friendList);

    let player = this.getPlayer(all);
    let clan = this.getClan(all);

    this.state = {
      player,
      clan,
      goodWidth: bestWidth(400),
    };
  }

  updateBestWidth = (event: LayoutChangeEvent): void => {
    const newWidth = event.nativeEvent.layout.width;
    this.setState({goodWidth: bestWidth(400, newWidth)});
  };

  getPlayer = (all: FriendList): PlayerItem[] => {
    let player: PlayerItem[] = [];
    for (let ID in all.player) {
      player.push(all.player[ID]);
    }
    return player;
  };

  getClan = (all: FriendList): ClanItem[] => {
    let clan: ClanItem[] = [];
    for (let ID in all.clan) {
      clan.push(all.clan[ID]);
    }
    return clan;
  };

  render(): JSX.Element {
    const {player, clan, goodWidth} = this.state;

    return (
      <View onLayout={this.updateBestWidth}>
        <SectionTitle
          title={`${lang.friend_clan_title} - ${SafeValue(clan.length, 0)}`}
        />
        <View style={styles.wrap}>
          {clan.map(item => (
            <List.Item
              style={{width: goodWidth}}
              title={item.tag}
              onPress={() => this.pushToClan(item)}
              description={`${item.clan_id}`}
              key={String(item.clan_id)}
              right={() => (
                <IconButton
                  color={Colors.grey500}
                  icon="close"
                  onPress={() => this.removeClan(item)}
                />
              )}
            />
          ))}
        </View>
        <SectionTitle
          title={`${lang.friend_player_title} - ${SafeValue(player.length, 0)}`}
        />
        <View style={styles.wrap}>
          {player.map((item: PlayerItem) => (
            <List.Item
              style={{width: goodWidth}}
              title={item.nickname}
              onPress={() => this.pushToPlayer(item)}
              description={`${item.account_id}`}
              key={String(item.account_id)}
              right={() => (
                <IconButton
                  color={Colors.grey500}
                  icon="close"
                  onPress={() => this.removeFriend(item)}
                />
              )}
            />
          ))}
        </View>
      </View>
    );
  }

  removeFriend(info: PlayerItem): void {
    let str = LOCAL.friendList;
    delete AppGlobalData.get(str).player[info.account_id];
    SafeStorage.set(str, AppGlobalData.get(str));
    this.setState({player: this.getPlayer(AppGlobalData.get(str))});
  }

  removeClan(info: ClanItem): void {
    let str = LOCAL.friendList;
    delete AppGlobalData.get(str).clan[info.clan_id];
    SafeStorage.set(str, AppGlobalData.get(str));
    this.setState({clan: this.getClan(AppGlobalData.get(str))});
  }

  pushToPlayer(info: PlayerItem): void {
    SafeAction('Statistics', {info: info});
  }

  pushToClan(info: ClanItem): void {
    SafeAction('ClanInfo', {info: info});
  }
}

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
