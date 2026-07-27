import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ProgressBar, Caption} from 'react-native-paper';
import {lang} from '../../value/lang';

const renderProgress = (value: number, title: string) => {
  if (value && value > 0) {
    return (
      <View>
        <View style={styles.header}>
          <Caption>{title}</Caption>
          <Caption>{value}</Caption>
        </View>
        <ProgressBar progress={value / 100} />
      </View>
    );
  }
  return null;
};

const WarshipStat = ({profile}: {profile: Record<string, unknown>}) => {
  const {mobility, weaponry, concealment, armour} = profile;
  const {anti_aircraft, aircraft, artillery, torpedoes} = weaponry;

  return (
    <View style={styles.container}>
      {renderProgress(armour.total, lang.warship_survivability)}
      {renderProgress(artillery, lang.warship_artillery)}
      {renderProgress(torpedoes, lang.warship_torpedoes)}
      {renderProgress(anti_aircraft, lang.warship_antiaircraft)}
      {renderProgress(mobility.total, lang.warship_maneuverability)}
      {renderProgress(aircraft, lang.warship_aircraft)}
      {renderProgress(concealment.total, lang.warship_concealment)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
  },
  header: {
    flex: 1,
    padding: 0,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export {WarshipStat};
