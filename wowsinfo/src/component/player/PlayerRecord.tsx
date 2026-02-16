/**
 * PlayerRecord.tsx
 *
 * Records for all weapons
 */

import React, {Component} from 'react';
import {View, StyleSheet, LayoutChangeEvent} from 'react-native';
import {Paragraph} from 'react-native-paper';
import {SAVED} from '../../value/data';
import {WarshipCell} from '../wiki/WarshipCell';
import {InfoLabel} from '../common/InfoLabel';
import {roundTo, SafeAction, bestWidth} from '../../core';
import {lang} from '../../value/lang';
import {SectionTitle} from '../common/SectionTitle';

interface WeaponRecord {
  frags: number;
  max_frags_battle: number;
  max_frags_ship_id?: number;
  hits?: number;
  shots?: number;
}

interface MaxRecord {
  name: string;
  num?: number;
  id?: number;
}

interface PlayerRecordData {
  aircraft?: WeaponRecord;
  main_battery: WeaponRecord;
  ramming?: WeaponRecord;
  second_battery?: WeaponRecord;
  torpedoes?: WeaponRecord;
  max_damage_dealt?: number;
  max_damage_dealt_ship_id?: number;
  max_frags_battle?: number;
  max_frags_ship_id?: number;
  max_planes_killed?: number;
  max_planes_killed_ship_id?: number;
  max_ships_spotted?: number;
  max_ships_spotted_ship_id?: number;
  max_xp?: number;
  max_xp_ship_id?: number;
  max_damage_scouting?: number;
  max_scouting_damage_ship_id?: number;
  max_total_agro?: number;
  max_total_agro_ship_id?: number;
}

interface PlayerRecordProps {
  data?: PlayerRecordData;
}

interface PlayerRecordState {
  goodWidth: number;
}

class PlayerRecord extends Component<PlayerRecordProps, PlayerRecordState> {
  state: PlayerRecordState = {
    goodWidth: bestWidth(400),
  };

  render(): JSX.Element | null {
    const {container, wrap} = styles;
    const {data} = this.props;
    if (!data) {
      return null;
    }

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

    // Max records
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

    // Best ships
    let records = [
      {name: lang.warship_artillery_main, data: main_battery},
      {name: lang.warship_artillery_secondary, data: second_battery},
      {name: lang.warship_torpedoes, data: torpedoes},
      {name: lang.warship_aircraft, data: aircraft},
      {name: lang.warship_ramming, data: ramming},
    ];

    return (
      <View style={container} onLayout={this.updateBestWidth}>
        <SectionTitle title={lang.record_title} />
        <View style={wrap}>{max.map(data => this.renderMax(data))}</View>
        <View style={wrap}>{records.map(data => this.renderRecord(data))}</View>
      </View>
    );
  }

  updateBestWidth = (event: LayoutChangeEvent): void => {
    const newWidth = event.nativeEvent.layout.width;
    this.setState({goodWidth: bestWidth(400, newWidth)});
  };

  renderMax(data: MaxRecord): JSX.Element | null {
    const {record, container} = styles;
    const {num, id, name} = data;
    if (!id) {
      return null;
    }
    const ship = AppGlobalData.get(SAVED.warship)[id];
    return (
      <View style={[record, {width: this.state.goodWidth}]} key={name}>
        <View style={container}>
          <WarshipCell
            item={ship}
            scale={2}
            onPress={() => SafeAction('WarshipDetail', {item: ship})}
          />
        </View>
        <View style={container}>
          <InfoLabel title={name} info={num} />
        </View>
      </View>
    );
  }

  renderRecord(item: {name: string; data?: WeaponRecord}): JSX.Element | null {
    const {record, container} = styles;
    const {name, data} = item;
    if (!data) {
      return null;
    }
    const {frags, max_frags_battle, max_frags_ship_id, hits, shots} = data;
    if (!max_frags_ship_id) {
      return null;
    }
    const bestShip = AppGlobalData.get(SAVED.warship)[max_frags_ship_id];
    return (
      <View style={{width: this.state.goodWidth}} key={name}>
        <SectionTitle title={name} center />
        <View style={record}>
          <View style={container}>
            <Paragraph>{lang.record_best_ship}</Paragraph>
            <WarshipCell
              item={bestShip}
              scale={2}
              onPress={() => SafeAction('WarshipDetail', {item: bestShip})}
            />
          </View>
          <View style={container}>
            <InfoLabel title={lang.weapon_total_frags} info={frags} />
            <InfoLabel title={lang.weapon_max_frags} info={max_frags_battle} />
            {hits && shots ? (
              <InfoLabel
                title={lang.weapon_hit_ratio}
                info={`${roundTo((hits / shots) * 100, 2)}%`}
              />
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

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
