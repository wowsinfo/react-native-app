import React, {useState, useMemo, useCallback} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {WoWsInfo, Space, SectionTitle} from '../../component';
import {Actions} from '../../core/navigation/Actions';
import {SAVED, getCurrDomain} from '../../value/data';
import {ThemeBackColour} from '../../value/colour';
import {List, Caption} from 'react-native-paper';
import {lang} from '../../value/lang';
import {useAppStore} from '../../store/useAppStore';

const normaliseKey = (key: string) => {
  let names = key.split('_');
  const upperFirst = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  names.map((n, i) => (names[i] = upperFirst(n)));
  let name = names.join('');
  if (name === 'FireControl') name = 'Suo';
  return name;
};

const WarshipModule = ({route}: any) => {
  const {ship_id, modules_tree} = route?.params?.data ?? {};
  const server = useMemo(() => getCurrDomain(), []);

  const [module, setModule] = useState({
    Artillery: '',
    DiveBomber: '',
    Engine: '',
    Fighter: '',
    FlightControl: '',
    Hull: '',
    Suo: '',
    TorpedoBomber: '',
    Torpedoes: '',
  });
  const [tree] = useState(modules_tree);

  const section = useMemo(() => {
    const data = route?.params?.data ?? {};
    const {modules} = data;
    let moduleName = useAppStore
      .getState()
      .getData(SAVED.encyclopedia).ship_modules;
    let result: any[] = [];
    for (let key in modules) {
      let curr = modules[key];
      if (curr.length > 1) {
        let sorted = [...curr].sort((a: any, b: any) => {
          let aM = tree[a];
          let bM = tree[b];
          if (aM.price_xp !== bM.price_xp) return aM.price_xp - bM.price_xp;
          if (aM.next_modules != null && bM.next_modules != null) {
            return aM.next_modules[0] == b ? -1 : 1;
          }
          return aM.next_modules != null ? -1 : 1;
        });
        result.push({title: moduleName[normaliseKey(key)], data: sorted});
      }
    }
    return result;
  }, [route?.params?.data, tree]);

  const updateModule = useCallback((t: any, ID: string) => {
    setModule(prev => ({...prev, [t[ID].type]: ID}));
  }, []);

  const apply = useCallback(() => {
    Actions.popTo('WarshipDetail');
    setTimeout(() => Actions.refresh({module}), 0);
  }, [module]);

  const renderModule = (ID: string) => {
    const {name, price_xp, price_credit} = tree[ID];
    let selected = Object.values(module).some(v => v === ID);
    return (
      <List.Item
        key={ID}
        style={selected ? ThemeBackColour() : undefined}
        title={name}
        description={`${price_credit}`}
        onPress={() => updateModule(tree, ID)}
        right={() =>
          price_xp > 0 ? (
            <Caption style={styles.xp}>{`${price_xp} xp`}</Caption>
          ) : null
        }
      />
    );
  };

  return (
    <WoWsInfo hideAds title={lang.warship_apply_module} onPress={apply}>
      <FlatList
        data={section}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <View key={item.title}>
            <SectionTitle title={item.title} />
            {item.data.map((d: string) => renderModule(d))}
          </View>
        )}
        keyExtractor={(_, i) => String(i)}
        inverted
        ListFooterComponent={<Space />}
      />
    </WoWsInfo>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  xp: {paddingRight: 4, alignSelf: 'center'},
});

export {WarshipModule};
