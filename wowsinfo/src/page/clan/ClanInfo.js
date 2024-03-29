/**
 * ClanInfo.js
 *
 * Display Clan information and can access each member's data
 */

import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  WoWsInfo,
  LoadingIndicator,
  InfoLabel,
  SectionTitle,
} from '../../component';
import {
  SafeFetch,
  Guard,
  humanTimeString,
  SafeAction,
  SafeStorage,
  SafeValue,
} from '../../core';
import {WoWsAPI} from '../../value/api';
import {getDomain, getPrefix, LOCAL} from '../../value/data';
import {
  Title,
  Subheading,
  Paragraph,
  List,
  Caption,
  Button,
} from 'react-native-paper';
import {TintColour} from '../../value/colour';
import {lang} from '../../value/lang';
import {FlatGrid} from 'react-native-super-grid';
import {SimpleViewHandler} from '../../core/native/SimpleViewHandler';

class ClanInfo extends Component {
  constructor(props) {
    super(props);

    const {clan_id, tag, server} = props.info;
    if (clan_id == null) {
      // This should never happen but just in case
      this.state = {
        id: '???',
        tag: SafeValue(tag, '???'),
      };
    } else {
      // When everything is Valid
      let friend = AppGlobalData.get(LOCAL.friendList);
      this.state = {
        id: clan_id,
        tag: tag,
        info: false,
        // Clan ID must be valid
        valid: true,
        canBeFriend: friend.clan[clan_id] == null,
      };

      this.server = server;
      this.domain = getDomain(server);
      this.prefix = getPrefix(server);

      SafeFetch.get(WoWsAPI.ClanInfo, this.domain, clan_id).then(data => {
        let clanInfo = Guard(data, `data.${clan_id}`, null);
        if (clanInfo != null) {
          this.setState({info: clanInfo});
        } else {
          this.setState({valid: false});
        }
      });
    }
  }

  render() {
    const {clanTag, container} = styles;
    const {info, tag, id, valid} = this.state;
    if (valid) {
      return (
        <WoWsInfo
          title={`- ${id} -`}
          onPress={() =>
            SimpleViewHandler.openURL(
              `https://${this.prefix}.wows-numbers.com/clan/${id}, ${tag}/`,
            )
          }>
          {this.renderClanInfo(info)}
        </WoWsInfo>
      );
    } else {
      return (
        <WoWsInfo title={`- ${id} -`} style={container}>
          <Title style={clanTag}>{tag}</Title>
        </WoWsInfo>
      );
    }
  }

  renderClanInfo(data) {
    if (data) {
      console.log(data);
      const {horizontal, clanTag} = styles;
      const {
        created_at,
        creator_name,
        creator_id,
        leader_name,
        leader_id,
        description,
        name,
        members,
        members_count,
        tag,
      } = data;
      const {canBeFriend} = this.state;

      let memberInfo = [];
      for (let ID in members) {
        memberInfo.push(members[ID]);
      }
      memberInfo.sort((a, b) => a.joined_at - b.joined_at);
      console.log(memberInfo);

      return (
        <FlatGrid
          ListHeaderComponent={() => (
            <View>
              <Title style={clanTag}>{tag}</Title>
              <Subheading
                style={{color: TintColour()[500], alignSelf: 'center'}}>
                {name}
              </Subheading>
              <InfoLabel
                title={lang.clan_created_date}
                info={humanTimeString(created_at)}
              />
              <View
                style={[horizontal, {flex: 1, justifyContent: 'space-around'}]}>
                <InfoLabel
                  title={lang.clan_creator_name}
                  info={creator_name}
                  onPress={() => this.pushToMaster(creator_name, creator_id)}
                />
                <InfoLabel
                  title={lang.clan_leader_name}
                  info={leader_name}
                  onPress={() => this.pushToMaster(leader_name, leader_id)}
                />
              </View>
              {canBeFriend ? (
                <Button
                  icon="contacts"
                  onPress={this.addFriend}
                  style={{padding: 4}}>
                  {lang.basic_add_friend}
                </Button>
              ) : null}
              <Paragraph style={{padding: 16}}>{description}</Paragraph>
              <SectionTitle
                style={{alignSelf: 'flex-start'}}
                title={`${lang.clan_member_title} - ${members_count}`}
              />
            </View>
          )}
          data={memberInfo}
          itemDimension={300}
          renderItem={({item}) => {
            return (
              <List.Item
                title={item.account_name}
                description={humanTimeString(item.joined_at)}
                onPress={() => this.pushToPlayer(item)}
                key={String(item.account_id)}
                right={() => (
                  <Caption style={{paddingRight: 8, alignSelf: 'center'}}>
                    {item.account_id}
                  </Caption>
                )}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
          spacing={0}
        />
      );
    } else {
      return <LoadingIndicator />;
    }
  }

  addFriend = () => {
    const {clan_id, tag, server} = this.props.info;
    let str = LOCAL.friendList;
    AppGlobalData.get(str).clan[clan_id] = {clan_id, tag, server};
    SafeStorage.set(str, AppGlobalData.get(str));
    this.setState({canBeFriend: false});
  };

  pushToMaster(name, id) {
    let item = {nickname: name, account_id: id, server: this.server};
    SafeAction('Statistics', {info: item});
  }

  pushToPlayer(item) {
    item.nickname = item.account_name;
    item.server = this.server;
    SafeAction('Statistics', {info: item});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clanTag: {
    alignSelf: 'center',
    fontSize: 36,
    fontWeight: '500',
    paddingTop: 16,
    textAlign: 'center',
  },
  horizontal: {
    flexDirection: 'row',
  },
});

export {ClanInfo};
