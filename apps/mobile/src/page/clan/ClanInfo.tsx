import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Linking} from 'react-native';
import {
  WoWsInfo,
  LoadingIndicator,
  InfoLabel,
  SectionTitle,
} from '../../component';
import {SafeFetch, Guard, humanTimeString, SafeAction} from '../../core';
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
import {useAppStore} from '../../store/useAppStore';

const ClanInfo = ({route}: any) => {
  const {clan_id, tag, server} = route?.params?.info ?? {};
  const [info, setInfo] = useState<any>(false);
  const [valid, setValid] = useState(clan_id != null);
  const [canBeFriend, setCanBeFriend] = useState(() => {
    if (clan_id == null) return true;
    const friend = useAppStore.getState().getData(LOCAL.friendList);
    return friend.clan[clan_id] == null;
  });

  const domain = getDomain(server);
  const prefix = getPrefix(server);

  useEffect(() => {
    if (clan_id == null) return;
    (async () => {
      const data = await SafeFetch.get(WoWsAPI.ClanInfo, domain, clan_id);
      const clanInfo = Guard(data, `data.${clan_id}`, null);
      if (clanInfo != null) {
        setInfo(clanInfo);
      } else {
        setValid(false);
      }
    })();
  }, [clan_id, domain]);

  const addFriend = useCallback(() => {
    const str = LOCAL.friendList;
    const cloned = JSON.parse(
      JSON.stringify(useAppStore.getState().getData(str)),
    );
    cloned.clan[clan_id] = {clan_id, tag, server};
    useAppStore.getState().setData(str, cloned);
    setCanBeFriend(false);
  }, [clan_id, tag, server]);

  const pushToMaster = useCallback(
    (name: string, id: number) => {
      SafeAction('Statistics', {
        info: {nickname: name, account_id: id, server},
      });
    },
    [server],
  );

  const pushToPlayer = useCallback(
    (item: any) => {
      item.nickname = item.account_name;
      item.server = server;
      SafeAction('Statistics', {info: item});
    },
    [server],
  );

  const {container, clanTag, horizontal} = styles;

  if (!valid) {
    return (
      <WoWsInfo title={`- ${clan_id ?? '???'} -`} style={container}>
        <Title style={clanTag}>{tag ?? '???'}</Title>
      </WoWsInfo>
    );
  }

  if (!info) {
    return (
      <WoWsInfo title={`- ${clan_id} -`}>
        <LoadingIndicator />
      </WoWsInfo>
    );
  }

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
    tag: clanTagName,
  } = info;

  const memberInfo = Object.values(members).sort(
    (a: any, b: any) => a.joined_at - b.joined_at,
  );

  return (
    <WoWsInfo
      title={`- ${clan_id} -`}
      onPress={() =>
        Linking.openURL(
          `https://${prefix}.wows-numbers.com/clan/${clan_id}, ${tag}/`,
        )
      }>
      <FlatGrid
        ListHeaderComponent={() => (
          <View>
            <Title style={clanTag}>{clanTagName}</Title>
            <Subheading style={{color: TintColour()[500], alignSelf: 'center'}}>
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
                onPress={() => pushToMaster(creator_name, creator_id)}
              />
              <InfoLabel
                title={lang.clan_leader_name}
                info={leader_name}
                onPress={() => pushToMaster(leader_name, leader_id)}
              />
            </View>
            {canBeFriend ? (
              <Button icon="contacts" onPress={addFriend} style={{padding: 4}}>
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
        renderItem={({item}: any) => (
          <List.Item
            title={item.account_name}
            description={humanTimeString(item.joined_at)}
            onPress={() => pushToPlayer(item)}
            key={String(item.account_id)}
            right={() => (
              <Caption style={{paddingRight: 8, alignSelf: 'center'}}>
                {item.account_id}
              </Caption>
            )}
          />
        )}
        showsVerticalScrollIndicator={false}
        spacing={0}
      />
    </WoWsInfo>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  clanTag: {
    alignSelf: 'center',
    fontSize: 36,
    fontWeight: '500',
    paddingTop: 16,
    textAlign: 'center',
  },
  horizontal: {flexDirection: 'row'},
});

export {ClanInfo};
