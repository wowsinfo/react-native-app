import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, ScrollView, StyleSheet, Linking} from 'react-native';
import {Text, IconButton, Title, Button, useTheme} from 'react-native-paper';
import {
  LoadingIndicator,
  WoWsInfo,
  FooterPlus,
  TabButton,
  InfoLabel,
  SectionTitle,
  PlayerRecord,
  DetailedInfo,
  RatingButton,
} from '../../../component';
import {
  SafeFetch,
  Guard,
  humanTimeString,
  SafeAction,
  getOverallRating,
  getColour,
} from '../../../core';
import {WoWsAPI} from '../../../value/api';
import {
  getDomain,
  getPrefix,
  LOCAL,
  setLastLocation,
} from '../../../value/data';
import {TintColour} from '../../../value/colour';
import {lang} from '../../../value/lang';
import {useAppStore} from '../../../store/useAppStore';

const Statistics = ({route}: any) => {
  const theme = useTheme();
  const ID = Guard(route, 'params.info.account_id', null);
  const {account_id, nickname, server} = route?.params?.info ?? {};

  const [name] = useState(nickname);
  const [id] = useState(account_id);
  const [serverState] = useState(server);
  const [valid, setValid] = useState(ID != null && ID !== '');
  const [hidden, setHidden] = useState(false);
  const [canBeMaster, setCanBeMaster] = useState(() => {
    const master = useAppStore.getState().getData(LOCAL.userInfo);
    return master.account_id !== account_id;
  });
  const [canBeFriend, setCanBeFriend] = useState(() => {
    const friend = useAppStore.getState().getData(LOCAL.friendList);
    return friend.player[account_id] == null;
  });
  const [clan, setClan] = useState('');
  const [currRank, setCurrRank] = useState(0);
  const [rating, setRating] = useState(0);
  const [achievement, setAchievement] = useState<any>(false);
  const [rank, setRank] = useState<any>(false);
  const [rankShip, setRankShip] = useState<any>(false);
  const [ship, setShip] = useState<any>(false);
  const [basic, setBasic] = useState<any>(false);
  const [graph, setGraph] = useState<any>(false);
  const [showMore, setShowMore] = useState(false);
  const [ratingColor, setRatingColor] = useState('#607D8B');

  const domain = getDomain(serverState);
  const prefix = getPrefix(serverState);
  const mountedRef = useRef(true);
  const showMoreRef = useRef(showMore);
  showMoreRef.current = showMore;

  useEffect(() => {
    setLastLocation('Statistics');
    return () => {
      mountedRef.current = false;
      theme.colors.primary = TintColour()[500];
    };
  }, []);

  useEffect(() => {
    if (!valid || !domain) return;
    (async () => {
      const data = await SafeFetch.get(
        WoWsAPI.PlayerInfo,
        getDomain(serverState),
        id,
      );
      const hiddenVal = Guard(data, 'meta.hidden', null);
      let hiddenAccount = false;
      if (hiddenVal != null) {
        hiddenAccount = true;
        if (mountedRef.current) setHidden(true);
      }
      const player = Guard(data, `data.${id}`, null);
      if (player == null) {
        if (mountedRef.current) setValid(false);
      } else {
        const battle = Guard(player, 'statistics.pvp.battles', 0);
        if (!hiddenAccount && battle === 0 && mountedRef.current)
          setHidden(true);
        if (mountedRef.current) setBasic(player);
      }
    })();
  }, [id, serverState, valid, domain]);

  useEffect(() => {
    if (!valid || !domain) return;
    (async () => {
      const data = await SafeFetch.get(WoWsAPI.PlayerClan, domain, id);
      const tag = Guard(data, `data.${id}.clan.tag`, '');
      if (tag !== '' && mountedRef.current) setClan(tag);
    })();
  }, [id, domain, valid]);

  useEffect(() => {
    if (!valid || !domain) return;
    (async () => {
      const data = await SafeFetch.get(WoWsAPI.PlayerAchievement, domain, id);
      const a = Guard(data, `data.${id}.battle`, null);
      if (a != null && mountedRef.current) setAchievement(a);
    })();
  }, [id, domain, valid]);

  useEffect(() => {
    if (!valid || !domain) return;
    (async () => {
      const rankData = await SafeFetch.get(WoWsAPI.RankInfo, domain, id);
      const r = Guard(rankData, `data.${id}.seasons`, null);
      if (r != null) {
        const keys = Object.keys(r);
        if (keys.length > 0) {
          const last = keys.slice(-1)[0];
          const cr = Guard(r[last], 'rank_info.rank', 0);
          if (cr > 0 && mountedRef.current) setCurrRank(cr);
        }
        if (mountedRef.current) setRank(r);
      }
      const shipData = await SafeFetch.get(WoWsAPI.RankShipInfo, domain, id);
      const ships = Guard(shipData, `data.${id}`, null);
      if (ships != null) {
        const formatted: any = {};
        for (const s of ships) {
          const {seasons, ship_id} = s;
          for (const season in seasons) {
            if (formatted[season] == null) formatted[season] = [];
            const curr = seasons[season];
            const {rank_solo, rank_div2, rank_div3} = curr;
            if (rank_solo) {
              curr.pvp = curr.rank_solo;
              delete curr.rank_solo;
            } else if (rank_div2) {
              curr.pvp = curr.rank_div2;
              delete curr.rank_div2;
            } else if (rank_div3) {
              curr.pvp = curr.rank_div3;
              delete curr.rank_div3;
            } else continue;
            curr.ship_id = ship_id;
            formatted[season].push(curr);
          }
        }
        if (mountedRef.current) setRankShip(formatted);
      }
    })();
  }, [id, domain, valid]);

  useEffect(() => {
    if (!valid || !domain) return;
    (async () => {
      const data = await SafeFetch.get(WoWsAPI.ShipInfo, domain, id);
      const s = Guard(data, `data.${id}`, null);
      if (s != null && mountedRef.current) {
        const r = getOverallRating(s);
        setShip(s);
        setRating(r);
        setGraph(s);
        setRatingColor(getColour(r));
      }
    })();
  }, [id, domain, valid]);

  const setMainAccount = useCallback(() => {
    const info = {nickname, account_id: account_id, server: serverState};
    useAppStore.getState().setData(LOCAL.userInfo, info);
    if (mountedRef.current) setCanBeMaster(false);
  }, [nickname, account_id, serverState]);

  const addFriend = useCallback(() => {
    const info = {nickname, account_id: account_id, server: serverState};
    const str = LOCAL.friendList;
    const cloned = JSON.parse(
      JSON.stringify(useAppStore.getState().getData(str)),
    );
    cloned.player[info.account_id] = info;
    useAppStore.getState().setData(str, cloned);
    if (mountedRef.current) setCanBeFriend(false);
  }, [nickname, account_id, serverState]);

  const toggleShowMore = useCallback(() => {
    setShowMore(prev => !prev);
  }, []);

  if (id == null || id === '') {
    return (
      <WoWsInfo style={styles.error}>
        <Text>BUG</Text>
      </WoWsInfo>
    );
  }

  if (!valid) {
    return (
      <WoWsInfo style={styles.container}>
        <Text>{'Data is not valid\nPlease try again later'}</Text>
      </WoWsInfo>
    );
  }

  theme.colors.primary = ratingColor;
  return (
    <WoWsInfo
      style={styles.container}
      title={`- ${id} -`}
      onPress={() =>
        Linking.openURL(
          `https://${prefix}.wows-numbers.com/player/${id},${name}/`,
        )
      }>
      <ScrollView>
        {!basic ? (
          <View style={styles.container}>
            <Title style={styles.playerName}>{name}</Title>
            <LoadingIndicator />
          </View>
        ) : (
          (() => {
            const {
              created_at,
              leveling_tier,
              last_battle_time,
              nickname: nick,
            } = basic;
            const register = humanTimeString(created_at);
            const lastBattle = humanTimeString(last_battle_time);
            if (hidden) {
              return (
                <View style={styles.container}>
                  <View style={styles.horizontal}>
                    <SectionTitle title={nick} style={styles.playerName} />
                    <IconButton
                      icon="https"
                      size={24}
                      style={{alignSelf: 'center'}}
                    />
                  </View>
                  <View style={styles.hidden}>
                    {canBeFriend ? (
                      <Button icon="contacts" onPress={addFriend}>
                        {lang.basic_add_friend}
                      </Button>
                    ) : null}
                    <InfoLabel
                      left
                      title={lang.basic_register_date}
                      info={register}
                    />
                    <InfoLabel
                      left
                      title={lang.basic_last_battle}
                      info={lastBattle}
                    />
                    <InfoLabel
                      left
                      title={lang.basic_level_tier}
                      info={lang.basic_data_unknown}
                    />
                  </View>
                </View>
              );
            }
            let displayName = nick;
            if (clan !== '') displayName = `[${clan}]\n${nick}`;
            let extraInfo = `Lv ${leveling_tier}`;
            if (currRank > 0) extraInfo += ` | ⭐${currRank}`;
            return (
              <View style={styles.container}>
                <RatingButton rating={rating} />
                <Title style={styles.playerName}>{displayName}</Title>
                <Text style={styles.level}>{extraInfo}</Text>
                <View style={styles.horizontal}>
                  <InfoLabel title={lang.basic_register_date} info={register} />
                  <InfoLabel title={lang.basic_last_battle} info={lastBattle} />
                </View>
                <View style={{padding: 4}}>
                  {canBeFriend ? (
                    <Button icon="contacts" onPress={addFriend}>
                      {lang.basic_add_friend}
                    </Button>
                  ) : null}
                  {canBeMaster ? (
                    <Button icon="heart" onPress={setMainAccount}>
                      {lang.basic_set_main}
                    </Button>
                  ) : null}
                </View>
                {basic.statistics ? (
                  <View style={{paddingBottom: 8}}>
                    <DetailedInfo data={basic.statistics} more={showMore} />
                    <PlayerRecord data={basic.statistics.pvp} />
                  </View>
                ) : null}
              </View>
            );
          })()
        )}
      </ScrollView>
      <FooterPlus style={styles.footer}>
        <TabButton
          icon={{uri: 'AchievementTab'}}
          disabled={!achievement || Object.keys(achievement).length === 0}
          onPress={() => SafeAction('PlayerAchievement', {data: achievement})}
        />
        <TabButton
          icon={{uri: 'Ship'}}
          disabled={!ship || ship.length === 0}
          onPress={() => SafeAction('PlayerShip', {data: ship}, 1)}
        />
        <TabButton
          icon={{uri: 'Rank'}}
          disabled={!rank || !rankShip}
          onPress={() => SafeAction('Rank', {data: rank, ship: rankShip})}
        />
        <TabButton
          icon={{uri: 'Graph'}}
          disabled={!graph || graph.length === 0 || hidden}
          onPress={() => SafeAction('Graph', {data: graph})}
        />
      </FooterPlus>
    </WoWsInfo>
  );
};

const styles = StyleSheet.create({
  error: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  container: {flex: 1},
  horizontal: {flexDirection: 'row'},
  playerName: {
    alignSelf: 'center',
    fontSize: 32,
    fontWeight: '500',
    paddingTop: 32,
    paddingBottom: 8,
    textAlign: 'center',
  },
  level: {alignSelf: 'center', textAlign: 'center'},
  hidden: {paddingLeft: 16, alignItems: 'flex-start'},
  footer: {flexDirection: 'row', justifyContent: 'space-around'},
});

export default Statistics;
