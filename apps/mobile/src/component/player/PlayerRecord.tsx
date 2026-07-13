import React, {useState, useCallback} from 'react';
import {View, StyleSheet, LayoutChangeEvent} from 'react-native';
import {Paragraph} from 'react-native-paper';
import {SAVED} from '../../value/data';
import {WarshipCell} from '../wiki/WarshipCell';
import {InfoLabel} from '../common/InfoLabel';
import {roundTo, SafeAction, bestWidth} from '../../core';
import {lang} from '../../value/lang';
import {SectionTitle} from '../common/SectionTitle';
import {useAppStore} from '../../store/useAppStore';

const renderMax = (data: any, goodWidth: number) => {
  const {num, id, name} = data;
  if (!id) return null;
  const ship = useAppStore.getState().getData(SAVED.warship)[id];
  return (
    <View style={[styles.record, {width: goodWidth}]} key={name}>
      <View style={styles.container}>
        <WarshipCell
          item={ship}
          scale={2}
          onPress={() => SafeAction('WarshipDetail', {item: ship})}
        />
      </View>
      <View style={styles.container}>
        <InfoLabel title={name} info={num} />
      </View>
    </View>
  );
};

const renderRecord = (item: any, goodWidth: number) => {
  const {name, data} = item;
  const {frags, max_frags_battle, max_frags_ship_id, hits, shots} = data;
  if (!max_frags_ship_id) return null;
  const bestShip = useAppStore.getState().getData(SAVED.warship)[
    max_frags_ship_id
  ];
  return (
    <View style={{width: goodWidth}} key={name}>
      <SectionTitle title={name} center />
      <View style={styles.record}>
        <View style={styles.container}>
          <Paragraph>{lang.record_best_ship}</Paragraph>
          <WarshipCell
            item={bestShip}
            scale={2}
            onPress={() => SafeAction('WarshipDetail', {item: bestShip})}
          />
        </View>
        <View style={styles.container}>
          <InfoLabel title={lang.weapon_total_frags} info={frags} />
          <InfoLabel title={lang.weapon_max_frags} info={max_frags_battle} />
          {hits ? (
            <InfoLabel
              title={lang.weapon_hit_ratio}
              info={`${roundTo((hits / shots) * 100, 2)}%`}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
};

const PlayerRecord = ({data}: any) => {
  const [goodWidth, setGoodWidth] = useState(bestWidth(400));

  const updateBestWidth = useCallback((event: LayoutChangeEvent) => {
    const newWidth = event.nativeEvent.layout.width;
    setGoodWidth(bestWidth(400, newWidth));
  }, []);

  if (!data) return null;

  const {
    aircraft,
    main_battery,
    ramming,
    second_battery,
    torpedoes,
    max_damage_dealt,
    max_damage_dealt_ship_id,
    max_frags_battle,
    max_frags_ship_id,
    max_planes_killed,
    max_planes_killed_ship_id,
    max_ships_spotted,
    max_ships_spotted_ship_id,
    max_xp,
    max_xp_ship_id,
    max_damage_scouting,
    max_scouting_damage_ship_id,
    max_total_agro,
    max_total_agro_ship_id,
  } = data;

  let max = [
    {
      name: lang.record_max_damage_dealt,
      num: max_damage_dealt,
      id: max_damage_dealt_ship_id,
    },
    {
      name: lang.record_max_frags_battle,
      num: max_frags_battle,
      id: max_frags_ship_id,
    },
    {
      name: lang.record_max_planes_killed,
      num: max_planes_killed,
      id: max_planes_killed_ship_id,
    },
    {name: lang.record_max_xp, num: max_xp, id: max_xp_ship_id},
    {
      name: lang.record_max_ships_spotted,
      num: max_ships_spotted,
      id: max_ships_spotted_ship_id,
    },
    {
      name: lang.record_max_total_agro,
      num: max_total_agro,
      id: max_total_agro_ship_id,
    },
    {
      name: lang.record_max_damage_scouting,
      num: max_damage_scouting,
      id: max_scouting_damage_ship_id,
    },
  ];

  let records = [
    {name: lang.warship_artillery_main, data: main_battery},
    {name: lang.warship_artillery_secondary, data: second_battery},
    {name: lang.warship_torpedoes, data: torpedoes},
    {name: lang.warship_aircraft, data: aircraft},
    {name: lang.warship_ramming, data: ramming},
  ];

  return (
    <View style={styles.container} onLayout={updateBestWidth}>
      <SectionTitle title={lang.record_title} />
      <View style={styles.wrap}>{max.map(d => renderMax(d, goodWidth))}</View>
      <View style={styles.wrap}>
        {records.map(d => renderRecord(d, goodWidth))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  record: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  wrap: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export {PlayerRecord};
