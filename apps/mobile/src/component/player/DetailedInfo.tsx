import React, {useState, useCallback} from 'react';
import {View, StyleSheet, LayoutChangeEvent} from 'react-native';
import {InfoLabel} from '../common/InfoLabel';
import {roundTo, humanTimeString, currDeviceWidth} from '../../core';
import {lang} from '../../value/lang';
import {Info6Icon} from './Info6Icon';
import {Button} from 'react-native-paper';
import {Space} from '../common/Space';
import {SectionTitle} from '../common/SectionTitle';
import {onlyProVersion} from '../../value/data';

const renderShipRecord = (weapon: any) => {
  const {data, name} = weapon;
  if (data == null) {
    return null;
  }
  const {frags, max_frags_battle, hits, shots} = weapon.data;
  console.log(weapon);
  if (frags == 0) {
    return null;
  }
  return (
    <View style={styles.container} key={name}>
      <SectionTitle title={name} />
      <View style={styles.horizontal}>
        <InfoLabel title={lang.weapon_total_frags} info={frags} />
        <InfoLabel title={lang.weapon_max_frags} info={max_frags_battle} />
        {hits ? (
          <InfoLabel
            title={lang.weapon_hit_ratio}
            info={`${roundTo((hits / shots) * 100, 1)}%`}
          />
        ) : null}
      </View>
    </View>
  );
};

const renderAllShipRecord = (data: any, playerMode: boolean) => {
  const {aircraft, main_battery, ramming, second_battery, torpedoes} = data;
  let weapons = [
    {name: lang.warship_artillery_main, data: main_battery},
    {name: lang.warship_artillery_secondary, data: second_battery},
    {name: lang.warship_torpedoes, data: torpedoes},
    {name: lang.warship_aircraft, data: aircraft},
    {name: lang.warship_ramming, data: ramming},
  ];

  if (!playerMode) {
    return weapons.map(d => renderShipRecord(d));
  }
  return null;
};

const renderInfo = (data: any, playerMode: boolean) => {
  console.log(data);
  const {
    art_agro,
    torpedo_agro,
    battles,
    wins,
    losses,
    draws,
    survived_battles,
    survived_wins,
    damage_dealt,
    damage_scouting,
    planes_killed,
    ships_spotted,
    xp,
    frags,
    max_damage_dealt,
    max_damage_scouting,
    max_frags_battle,
    max_planes_killed,
    max_ships_spotted,
    max_xp,
  } = data;

  return (
    <View style={styles.container}>
      <View style={styles.horizontal}>
        <InfoLabel title={lang.detailed_win} info={wins} />
        <InfoLabel title={lang.detailed_draw} info={draws} />
        <InfoLabel title={lang.detailed_loss} info={losses} />
      </View>
      <View style={styles.horizontal}>
        <InfoLabel title={lang.detailed_survived} info={survived_battles} />
        <InfoLabel title={lang.detailed_total_xp} info={xp} />
        <InfoLabel title={lang.detailed_survived_win} info={survived_wins} />
      </View>
      <View style={styles.horizontal}>
        <InfoLabel
          title={lang.detailed_survival_rate}
          info={`${roundTo((survived_battles / battles) * 100, 2)}%`}
        />
        <InfoLabel
          title={lang.detailed_survived_win_rate}
          info={`${roundTo((survived_wins / survived_battles) * 100, 2)}%`}
        />
      </View>
      <Space height={16} />
      {art_agro ? (
        <View style={styles.container}>
          <View style={styles.horizontal}>
            <InfoLabel
              title={lang.detailed_total_potential_damage}
              info={art_agro}
            />
            <InfoLabel
              title={lang.detailed_avg_potential_damage}
              info={roundTo(art_agro / battles)}
            />
          </View>
          <View style={styles.horizontal}>
            <InfoLabel
              title={lang.detailed_total_torp_potential_damage}
              info={torpedo_agro}
            />
            <InfoLabel
              title={lang.detailed_avg_torp_potential_damage}
              info={roundTo(torpedo_agro / battles)}
            />
          </View>
          <View style={styles.horizontal}>
            <InfoLabel
              title={lang.detailed_total_scouting_damage}
              info={damage_scouting}
            />
            <InfoLabel
              title={lang.detailed_avg_scouting_damage}
              info={roundTo(damage_scouting / battles)}
            />
          </View>
          <View style={styles.horizontal}>
            <InfoLabel
              title={lang.detailed_total_damage}
              info={damage_dealt}
            />
            <InfoLabel
              title={lang.detailed_damage_potential_ratio}
              info={`${roundTo((damage_dealt / art_agro) * 100, 2)}%`}
            />
          </View>
          <Space height={16} />
          <View style={styles.horizontal}>
            <InfoLabel
              title={lang.detailed_total_spotted}
              info={ships_spotted}
            />
            <InfoLabel
              title={lang.detailed_avg_spotted}
              info={roundTo(ships_spotted / battles, 2)}
            />
          </View>
        </View>
      ) : null}
      <View style={styles.horizontal}>
        <InfoLabel title={lang.detailed_total_frag} info={frags} />
        <InfoLabel
          title={lang.detailed_frag_spot_ratio}
          info={`${roundTo((frags / ships_spotted) * 100, 2)}%`}
        />
      </View>
      <View style={styles.horizontal}>
        <InfoLabel
          title={lang.detailed_total_plane_killed}
          info={planes_killed}
        />
        <InfoLabel
          title={lang.detailed_avg_plane_killed}
          info={roundTo(planes_killed / battles, 2)}
        />
      </View>
      {!playerMode ? (
        <View style={styles.container}>
          <SectionTitle title={lang.record_title} />
          <View style={styles.horizontal}>
            <InfoLabel
              title={lang.record_max_damage_dealt}
              info={max_damage_dealt}
            />
            <InfoLabel
              title={lang.record_max_damage_scouting}
              info={max_damage_scouting}
            />
          </View>
          <View style={styles.horizontal}>
            <InfoLabel title={lang.record_max_xp} info={max_xp} />
            <InfoLabel
              title={lang.record_max_frags_battle}
              info={max_frags_battle}
            />
          </View>
          <View style={styles.horizontal}>
            <InfoLabel
              title={lang.record_max_ships_spotted}
              info={max_ships_spotted}
            />
            <InfoLabel
              title={lang.record_max_planes_killed}
              info={max_planes_killed}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

const renderMore = (data: any, playerMode: boolean) => {
  return renderInfo(data.pvp, playerMode);
};

const DetailedInfo = ({data, more: initialMore}: any) => {
  const [more, setMore] = useState(initialMore);
  const [width, setWidth] = useState(currDeviceWidth());

  const updateBestWidth = useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);

  if (!data) {
    return null;
  }

  const {last_battle_time, pvp} = data;
  let playerMode = false;
  if (pvp.max_damage_dealt_ship_id) {
    playerMode = true;
  }

  return (
    <View style={styles.container} onLayout={updateBestWidth}>
      {!playerMode ? (
        <InfoLabel
          title={lang.basic_last_battle}
          info={humanTimeString(last_battle_time)}
        />
      ) : null}
      <Info6Icon data={pvp} />
      {more ? (
        renderMore(data, playerMode)
      ) : (
        <Button
          onPress={() =>
            onlyProVersion() ? setMore(true) : null
          }>
          {lang.basic_more_stat}
        </Button>
      )}
      {renderAllShipRecord(data.pvp, playerMode)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
  },
});

export {DetailedInfo};
