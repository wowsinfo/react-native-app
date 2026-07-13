import React, {useState, useRef, useEffect, useCallback} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {
  Text,
  TextInput,
  List,
  Checkbox,
  Button,
  useTheme,
} from 'react-native-paper';
// @ts-ignore
import {GREY} from 'react-native-material-color';
import {blendWithWhite} from '../../value/colour';
import {WoWsInfo, FooterPlus, Space} from '../../component';
import {lang} from '../../value/lang';
import {SAVED} from '../../value/data';
import {getTierList} from '../../core';
import {Actions} from '../../core/navigation/Actions';
import {useAppStore} from '../../store/useAppStore';

const MODE = {TIER: 1, NATION: 2, TYPE: 3};

const WarshipFilter = () => {
  const searchRef = useRef(null);
  const scrollRef = useRef<ScrollView>(null);
  const theme = useTheme();

  const [premium, setPremium] = useState(false);
  const [name, setName] = useState('');
  const [nation, setNation] = useState<string[]>([]);
  const [type, setType] = useState<string[]>([]);
  const [tier, setTier] = useState<string[]>([]);

  useEffect(() => {
    scrollRef.current?.scrollTo({x: 0, y: 128, animated: false});
  }, []);

  const addData = useCallback(
    (item: string, mode: number) => {
      const getArr = () => {
        switch (mode) {
          case MODE.TIER:
            return tier;
          case MODE.NATION:
            return nation;
          case MODE.TYPE:
            return type;
        }
      };
      const setArr = (arr: string[]) => {
        switch (mode) {
          case MODE.TIER:
            setTier(arr);
            break;
          case MODE.NATION:
            setNation(arr);
            break;
          case MODE.TYPE:
            setType(arr);
            break;
        }
      };
      const arr = getArr();
      if (arr.slice(-1)[0] === item) return;
      const next = [...arr, item];
      setArr(next);
    },
    [tier, nation, type],
  );

  const resetAll = useCallback(() => {
    setPremium(false);
    setName('');
    setNation([]);
    setType([]);
    setTier([]);
  }, []);

  const applyAll = useCallback(() => {
    Actions.pop();
    setTimeout(
      () => Actions.refresh({filter: {premium, name, nation, type, tier}}),
      0,
    );
  }, [premium, name, nation, type, tier]);

  const renderButton = (item: string, onPress: () => void) => (
    <Button key={item} onPress={onPress}>
      {item}
    </Button>
  );

  const tierList = getTierList();
  const nations = useAppStore
    .getState()
    .getData(SAVED.encyclopedia).ship_nations;
  const nationList: string[] = [];
  Object.keys(nations).forEach(k => nationList.push(nations[k]));

  const types = useAppStore.getState().getData(SAVED.encyclopedia).ship_types;
  const typeList: string[] = [];
  Object.keys(types).forEach(k => typeList.push(types[k]));

  return (
    <WoWsInfo
      hideAds
      title={lang.wiki_warship_filter_placeholder}
      onPress={() => (searchRef.current as any)?.focus()}>
      <TextInput
        label={lang.wiki_warship_filter_placeholder}
        ref={searchRef}
        autoCorrect={false}
        style={{backgroundColor: theme.dark ? GREY[900] : blendWithWhite(theme.colors.primary, 0.15)}}
        theme={{roundness: 0, colors: {primary: theme.colors.primary}}}
        onChangeText={setName}
        onEndEditing={() => {
          if (name.trim(' ').length > 0) applyAll();
        }}
        clearButtonMode="while-editing"
        autoCapitalize="none"
      />
      <ScrollView ref={scrollRef}>
        <Space />
        <List.Section titleStyle={{color: theme.colors.onSurface}} title={lang.wiki_warship_filter_tier}>
          <Text style={styles.selectionText}>{`${tier.join(' | ')} `}</Text>
          <View style={styles.wrapView}>
            {tierList.map(item =>
              renderButton(item, () => addData(item, MODE.TIER)),
            )}
          </View>
        </List.Section>
        <List.Section titleStyle={{color: theme.colors.onSurface}} title={lang.wiki_warship_filter_nation}>
          <Text style={styles.selectionText}>{`${nation.join(' | ')} `}</Text>
          <View style={styles.wrapView}>
            {nationList.map(item =>
              renderButton(item, () => addData(item, MODE.NATION)),
            )}
          </View>
        </List.Section>
        <List.Section titleStyle={{color: theme.colors.onSurface}} title={lang.wiki_warship_filter_type}>
          <Text style={styles.selectionText}>{`${type.join(' | ')} `}</Text>
          <View style={styles.wrapView}>
            {typeList.map(item =>
              renderButton(item, () => addData(item, MODE.TYPE)),
            )}
          </View>
        </List.Section>
      </ScrollView>
      <FooterPlus>
        <List.Item
          title={lang.wiki_warship_filter_premium}
          onPress={() => setPremium(!premium)}
          right={() => <Checkbox status={premium ? 'checked' : 'unchecked'} />}
        />
        <View style={styles.horizontal}>
          <Button style={styles.button} onPress={resetAll}>
            {lang.wiki_warship_reset_btn}
          </Button>
          <Button style={styles.button} onPress={applyAll}>
            {lang.wiki_warship_filter_btn}
          </Button>
        </View>
      </FooterPlus>
    </WoWsInfo>
  );
};

const styles = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
  },
  selectionText: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  wrapView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});

export {WarshipFilter};
