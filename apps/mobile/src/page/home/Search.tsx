import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  LayoutChangeEvent,
} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {WoWsInfo, SectionTitle, PlayerCell} from '../../component';
import {
  getCurrDomain,
  getCurrPrefix,
  getCurrServer,
  setLastLocation,
} from '../../value/data';
import {Guard, SafeFetch, bestWidth} from '../../core';
import {WoWsAPI} from '../../value/api';
import {Friend} from './Friend';
import {lang} from '../../value/lang';
import {TintBackgroundColour} from '../../value/colour';

const Search = () => {
  const searchRef = useRef(null);
  const prefix = getCurrPrefix();
  const [search, setSearch] = useState('');
  const [server] = useState('');
  const [result, setResult] = useState({player: [], clan: []});
  const [online, setOnline] = useState('???');
  const [showFriend, setShowFriend] = useState(true);
  const [goodWidth, setGoodWidth] = useState(bestWidth(400));

  useEffect(() => {
    setLastLocation('Search');
    (async () => {
      const domain = getCurrDomain();
      const num = await SafeFetch.get(WoWsAPI.PlayerOnline, domain);
      const n = Guard(num, 'data.wows.0.players_online', '???');
      setOnline(n);
    })();
  }, []);

  const updateWidth = useCallback((event: LayoutChangeEvent) => {
    const newWidth = event.nativeEvent.layout.width;
    setGoodWidth(bestWidth(400, newWidth));
  }, []);

  const delayedRequest = useRef<ReturnType<typeof setTimeout>>();

  const searchAll = useCallback((text: string) => {
    if (text.length < 2) {
      setResult({player: [], clan: []});
    }
    setSearch(text);
    setShowFriend(text.length < 2);

    clearTimeout(delayedRequest.current);
    delayedRequest.current = setTimeout(async () => {
      const domain = getCurrDomain();
      const all: any = {player: [], clan: []};
      const length = text.length;

      if (length > 1 && length < 6) {
        const clanResult = await SafeFetch.get(
          WoWsAPI.ClanSearch,
          domain,
          text,
        );
        const clanData = Guard(clanResult, 'data', null);
        if (clanData != null) {
          clanData.forEach((v: any) => (v.server = getCurrServer()));
          all.clan = clanData;
          setResult({...all});
        }
      }

      if (length > 2) {
        const playerResult = await SafeFetch.get(
          WoWsAPI.PlayerSearch,
          domain,
          text,
        );
        const playerData = Guard(playerResult, 'data', null);
        if (playerData != null) {
          playerData.forEach((v: any) => (v.server = getCurrServer()));
          all.player = playerData;
          setResult({...all});
        }
      }
    }, 500);
  }, []);

  const renderClan = (clan: any[]) => {
    if (clan.length > 0) {
      return (
        <View style={styles.wrap}>
          {clan.map(item => (
            <PlayerCell key={item.clan_id} item={item} clan width={goodWidth} />
          ))}
        </View>
      );
    }
    return null;
  };

  const renderPlayer = (player: any[]) => {
    if (player.length > 0) {
      return (
        <View style={styles.wrap}>
          {player.map(item => (
            <PlayerCell
              key={item.account_id}
              item={item}
              player
              width={goodWidth}
            />
          ))}
        </View>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (showFriend && search.length < 2) {
      return <Friend />;
    }
    const playerLen = result.player.length;
    const clanLen = result.clan.length;
    return (
      <View>
        <SectionTitle title={`${lang.menu_search_clan} - ${clanLen}`} />
        {renderClan(result.clan)}
        <SectionTitle title={`${lang.menu_search_player} - ${playerLen}`} />
        {renderPlayer(result.player)}
      </View>
    );
  };

  return (
    <WoWsInfo
      hideAds
      title={lang.menu_footer}
      onPress={() => (searchRef.current as any)?.focus()}>
      <KeyboardAvoidingView behavior={undefined} style={{flex: 1}}>
        <Searchbar
          ref={searchRef}
          value={search}
          style={styles.searchBar}
          iconColor={TintBackgroundColour()}
          placeholder={`${prefix.toUpperCase()} - ${online} ${
            lang.search_player_online
          }`}
          onChangeText={searchAll}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <ScrollView
          style={styles.scroll}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{flexGrow: 1}}
          onLayout={updateWidth}>
          {renderContent()}
        </ScrollView>
      </KeyboardAvoidingView>
    </WoWsInfo>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    position: 'absolute',
    zIndex: 2,
    top: 16,
    left: 16,
    right: 16,
    borderRadius: 100,
  },
  scroll: {
    marginTop: 64,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export {Search};
