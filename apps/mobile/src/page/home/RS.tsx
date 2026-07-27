import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Linking,
  Alert,
  Vibration,
} from 'react-native';
import {isAndroid, isTablet} from 'react-native-device-detection';
import {
  Portal,
  TextInput,
  Button,
  Dialog,
  List,
  Text,
  Title,
  useTheme,
} from 'react-native-paper';
import {
  WoWsInfo,
  LoadingIndicator,
  Touchable,
  WarshipCell,
  SimpleRating,
  RatingButton,
} from '../../component';
import {
  SafeFetch,
  roundTo,
  Guard,
  getOverallRating,
  SafeAction,
  SafeValue,
  random,
} from '../../core';
import {WoWsAPI} from '../../value/api';
import {
  getCurrDomain,
  SAVED,
  LOCAL,
  getCurrServer,
  setLastLocation,
} from '../../value/data';
import {FlatGrid} from 'react-native-super-grid';
import {lang} from '../../value/lang';
import KeepAwake from 'react-native-keep-awake';
import {getTintColour} from '../../value/colour';
import {useAppStore} from '../../store/useAppStore';

const RS = () => {
  const store = useAppStore;
  const gs = () => store.getState();
  const theme = useTheme();
  const domain = getCurrDomain();

  const [ip, setIp] = useState(() => gs().getData(LOCAL.rsIP) ?? '');
  const [rs, setRs] = useState<any>(null);
  const [valid, setValid] = useState(false);
  const [info, setInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [battleTime, setBattleTime] = useState('');
  const [allay, setAllay] = useState<any[]>([]);
  const [allayInfo, setAllayInfo] = useState({});
  const [enemy, setEnemy] = useState<any[]>([]);
  const [enemyInfo, setEnemyInfo] = useState({});

  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    setLastLocation('RS');
    KeepAwake.activate();
    if (ip !== '') {
      validIP(ip);
    }
    return () => {
      KeepAwake.deactivate();
      clearInterval(intervalRef.current);
      theme.colors.primary = getTintColour()[500];
    };
  }, []);

  const validIP = useCallback(async (ipStr: string) => {
    let url = 'http://' + ipStr.split('/').join('') + ':8605';
    try {
      await fetch(url);
      setValid(true);
      gs().setData(LOCAL.rsIP, ipStr);
      getArenaInfo(url);
      intervalRef.current = setInterval(() => getArenaInfo(url), 22222);
    } catch {
      Alert.alert('Error', `${url} is not valid`);
    }
  }, []);

  const appendExtraInfo = useCallback(
    async (player: any) => {
      const {name, shipId} = player;
      if (name.startsWith(':')) return player;
      let idInfo = await SafeFetch.get(WoWsAPI.PlayerSearch, domain, name);
      let playerID: any = Guard(idInfo, 'data.0', null);
      if (playerID != null) {
        player.ship_id = player.shipId;
        delete player.shipId;
        delete player.id;
        delete player.name;
        player.account_id = playerID.account_id;
        player.nickname = playerID.nickname;
        let shipInfo = await SafeFetch.get(
          WoWsAPI.OneShipInfo,
          domain,
          shipId,
          player.account_id,
        );
        let pvp = Guard(shipInfo, `data.${player.account_id}.0.pvp`, null);
        if (pvp != null) player.pvp = pvp;
      }
      return player;
    },
    [domain],
  );

  const getArenaInfo = useCallback(
    async (url: string) => {
      try {
        const response = await fetch(url);
        let text = await response.text();
        if (text !== '[]') {
          const data = JSON.parse(text);
          setRs(data);
          if (data.dateTime !== battleTime) {
            setLoading(true);
            setBattleTime(data.dateTime);
            const vehicles = data.vehicles;
            let allayList: any[] = [];
            let enemyList: any[] = [];
            for (const v of vehicles) {
              setTimeout(async () => {
                const player = await appendExtraInfo(v);
                const team = player.relation;
                if (team < 2) {
                  allayList.push(player);
                } else {
                  enemyList.push(player);
                }
                if (player.account_id == null) {
                  player.account_id = random(88888888);
                }
                setAllay([...allayList]);
                setEnemy([...enemyList]);
                setLoading(false);
              }, 300);
            }
          }
        }
      } catch {
        clearInterval(intervalRef.current);
        setValid(false);
        setRs(null);
      }
    },
    [battleTime, appendExtraInfo],
  );

  const renderPlayerCell = useCallback((info: any) => {
    const {nickname, name} = info;
    let pName = SafeValue(nickname, name);
    info.server = getCurrServer();
    const ship = gs().getData(SAVED.warship)[info.ship_id];
    return (
      <Touchable
        style={styles.cell}
        onPress={
          info.pvp ? () => SafeAction('PlayerShipDetail', {data: info}) : null
        }
        onLongPress={
          info.account_id ? () => SafeAction('Statistics', {info: info}) : null
        }>
        <WarshipCell item={ship} scale={1.4} />
        <Text style={styles.playerName} numberOfLines={1}>
          {pName}
        </Text>
        <SimpleRating info={info} />
      </Touchable>
    );
  }, []);

  const renderPlayer = () => {
    if (loading) return <LoadingIndicator />;
    let allayRating = getOverallRating(allay);
    let enemyRating = getOverallRating(enemy);
    const sortedAllay = [...allay].sort((a: any, b: any) => b.ap - a.ap);
    const sortedEnemy = [...enemy].sort((a: any, b: any) => b.ap - a.ap);

    return (
      <ScrollView>
        <View style={[styles.horizontal, {justifyContent: 'space-between'}]}>
          <RatingButton rating={allayRating} number />
          <Title>RS Beta</Title>
          <RatingButton rating={enemyRating} number />
        </View>
        <View style={styles.horizontal}>
          <FlatGrid
            data={sortedAllay}
            itemDimension={120}
            renderItem={({item}) => renderPlayerCell(item)}
            keyExtractor={p => String(p.account_id)}
            style={{width: '50%'}}
          />
          <FlatGrid
            data={sortedEnemy}
            itemDimension={120}
            renderItem={({item}) => renderPlayerCell(item)}
            keyExtractor={p => String(p.account_id)}
            style={{width: '50%'}}
          />
        </View>
      </ScrollView>
    );
  };

  const renderMapInfo = () => {
    if (rs === null) return null;
    const {
      clientVersionFromExe,
      dateTime,
      duration,
      gameLogic,
      mapDisplayName,
      matchGroup,
      name,
      weatherParams,
    } = rs;
    let params = '';
    for (let ID in weatherParams) {
      let curr = weatherParams[ID].join(', ');
      params += curr + '\n';
    }

    return (
      <Portal>
        <Dialog
          visible={info}
          dismissable={true}
          theme={{roundness: 16}}
          style={{maxHeight: '61.8%'}}
          onDismiss={() => setInfo(false)}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <List.Item
              title="Client Version"
              description={clientVersionFromExe}
            />
            <List.Item title="Time" description={dateTime} />
            <List.Item
              title="Game Mode"
              description={`${matchGroup} - ${gameLogic} - ${name}`}
            />
            <List.Item title="Map" description={mapDisplayName} />
            <List.Item
              title="Duration"
              description={`${roundTo(duration / 60)} min`}
            />
            <Text style={{paddingLeft: 16}}>{params}</Text>
          </ScrollView>
        </Dialog>
      </Portal>
    );
  };

  return (
    <WoWsInfo onPress={rs ? () => setInfo(true) : null} title="Map Information">
      {!valid ? (
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled>
          <TextInput
            style={styles.input}
            theme={{roundness: 0}}
            value={ip}
            placeholder="192.168.1.x"
            keyboardType={isAndroid ? 'decimal-pad' : 'numbers-and-punctuation'}
            onChangeText={setIp}
            onEndEditing={() => validIP(ip)}
          />
          <Button
            uppercase={false}
            onPress={() =>
              Linking.openURL(
                'https://github.com/wowsinfo/WoWs-RS//releases/latest',
              )
            }>
            {lang.extra_rs_beta_download}
          </Button>
        </KeyboardAvoidingView>
      ) : (
        renderPlayer()
      )}
      {renderMapInfo()}
    </WoWsInfo>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  input: {width: '100%', marginBottom: 8},
  horizontal: {flexDirection: 'row', padding: 8},
  playerName: {
    fontWeight: '300',
    fontSize: 17,
    marginBottom: 8,
    textAlign: 'center',
  },
  cell: {margin: 4},
});

export default RS;
