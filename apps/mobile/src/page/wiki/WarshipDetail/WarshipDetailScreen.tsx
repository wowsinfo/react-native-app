import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import {View, FlatList, ScrollView, StyleSheet, Linking} from 'react-native';
import {Text, Title, Button, Paragraph} from 'react-native-paper';
import * as Anime from 'react-native-animatable';
import {
  WoWsInfo,
  WikiIcon,
  WarshipCell,
  PriceLabel,
  LoadingIndicator,
  WarshipStat,
  InfoLabel,
  FooterPlus,
  SectionTitle,
} from '../../../component';
import {SAVED, langStr, getCurrDomain} from '../../../value/data';
import {lang} from '../../../value/lang';
import {SafeFetch, Guard, SafeAction, copy, roundTo} from '../../../core';
import {WoWsAPI} from '../../../value/api';
import {Actions} from '../../../core/navigation/Actions';
import {HorizontalBarChart} from 'native-chart-experiment';
import {useAppStore} from '../../../store/useAppStore';

const renderStatus = (profile: any) => {
  if (!profile) return null;
  return <WarshipStat profile={profile} />;
};

const renderSurvivability = (curr: any) => {
  if (!curr) return null;
  let armour = Guard(curr, 'default_profile.armour', null);
  let tier = Guard(curr, 'tier', null);
  if (!armour) return null;
  const {flood_prob, range, health} = armour;
  return (
    <View style={styles.margin}>
      <SectionTitle title={lang.warship_survivability} />
      <View style={styles.horizontal}>
        <InfoLabel title={lang.warship_survivability_health} info={`${health} - ${health + tier * 350}`} />
        <InfoLabel title={lang.warship_survivability_armour} info={`${range.min} - ${range.max} mm`} />
        {flood_prob == 0 ? null : (
          <InfoLabel title={lang.warship_survivability_protection} info={`${flood_prob}%`} />
        )}
      </View>
    </View>
  );
};

const renderBasic = (curr: any, data: any) => {
  const {name, model, type, nation, ship_id} = curr;
  const {description} = data;

  let currShip = useAppStore.getState().getData(SAVED.pr)[ship_id];
  let avgDamage = Guard(currShip, 'average_damage_dealt', 0);
  let avgWinrate = Guard(currShip, 'win_rate', 0);
  let avgFrag = Guard(currShip, 'average_frags', 0);

  return (
    <View style={styles.container}>
      <Title style={[styles.shipTitle, {marginTop: 8}]}>{name}</Title>
      {currShip ? (
        <View style={[styles.horizontal, {marginBottom: 16}]}>
          <InfoLabel title={lang.warship_avg_damage} info={Number(avgDamage).toFixed(0)} />
          <InfoLabel title={lang.warship_avg_winrate} info={`${Number(avgWinrate).toFixed(1)}%`} />
          <InfoLabel title={lang.warship_avg_frag} info={Number(avgFrag).toFixed(2)} />
        </View>
      ) : null}
      <Text>{nation.toUpperCase()}</Text>
      <Text>{type}</Text>
      <PriceLabel item={data} />
      {model ? (
        <Button style={styles.modelBtn} onPress={() => Linking.openURL(`https://sketchfab.com/models/${model}/embed?autostart=1&preload=1`)}>
          {lang.warship_model}
        </Button>
      ) : null}
      <Paragraph style={[styles.centerText, styles.margin]}>{description}</Paragraph>
    </View>
  );
};

const renderMainBattery = (artillery: any, upgrades: any[]) => {
  if (!artillery) return null;
  const {max_dispersion, gun_rate, distance, rotation_time, slots, shells} = artillery;
  const {AP, HE} = shells;

  var mainGun = '', gunName = '';
  for (var gun in slots) {
    mainGun += slots[gun].guns + ' x ' + slots[gun].barrels + '  ';
  }
  gunName = slots[gun].name;
  let calibar = parseInt(gunName.split(' ')[0], 10);
  let fireRate = 0, penetration = '', overmatch = '';
  if (HE) {
    fireRate = calibar > 160 ? 4 : 3;
    var oneFourth = Number(calibar / 4).toFixed(1);
    var oneFifth = Number(calibar / 5).toFixed(1);
    var oneSixth = Number(calibar / 6).toFixed(1);
    penetration = `1/6 | ${oneSixth} - ${Number(oneSixth * 1.25).toFixed(1)} mm\n1/5 | ${oneFifth} - ${Number(oneFifth * 1.25).toFixed(1)} mm\n1/4 | ${oneFourth} - ${Number(oneFourth * 1.25).toFixed(1)} mm`;
    fireRate += HE.burn_probability;
  }
  if (AP) {
    overmatch = `${Number(calibar / 14.3).toFixed(2)} mm\n`;
  }

  let reload = Number(60 / gun_rate).toFixed(1);
  let re1 = calibar <= 139 ? 0.9 : 1;
  let re2 = upgrades.findIndex(u => u === 4280471472) > -1 ? 0.88 : 1;
  let bestReload = Number((60 / gun_rate) * re1 * re2).toFixed(1);
  let reloadMsg = reload === bestReload ? `${reload} s` : `${reload} - ${bestReload} s`;

  let range = Number(distance).toFixed(1);
  let ra1 = calibar <= 139 ? 1.2 : 1;
  let ra2 = upgrades.findIndex(u => u === 4278374320) > -1 ? 1.16 : 1;
  let bestRange = Number(distance * ra1 * ra2).toFixed(1);
  let rangeMsg = range === bestRange ? `${range} km` : `${range} - ${bestRange} km`;

  return (
    <View style={styles.margin}>
      <SectionTitle title={lang.warship_artillery_main} />
      <View style={styles.horizontal}>
        <InfoLabel title={lang.warship_weapon_reload} info={reloadMsg} />
        <InfoLabel title={lang.warship_weapon_range} info={rangeMsg} />
        <InfoLabel title={lang.warship_weapon_configuration} info={mainGun} />
      </View>
      <View style={styles.horizontal}>
        <InfoLabel title={lang.warship_weapon_dispersion} info={`${max_dispersion} m`} />
        <InfoLabel title={lang.warship_weapon_rotation} info={`${rotation_time} s`} />
      </View>
      <Title style={styles.centerText}>{gunName}</Title>
      <View style={styles.horizontal}>
        {HE == null ? null : (
          <View>
            <Title style={styles.centerText}>HE</Title>
            <InfoLabel title={lang.warship_weapon_fire_chance} info={`🔥${HE.burn_probability} - ${fireRate}%`} />
            <InfoLabel title={lang.warship_artillery_main_weight} info={`${HE.bullet_mass} kg`} />
            <InfoLabel title={lang.warship_weapon_damage} info={`${HE.damage}`} />
            <InfoLabel title={lang.warship_weapon_speed} info={`${HE.bullet_speed} m/s`} />
            <InfoLabel title={lang.warship_weapon_he_penetration} info={penetration} />
          </View>
        )}
        {AP == null ? null : (
          <View>
            <Title style={styles.centerText}>AP</Title>
            <InfoLabel title={lang.warship_weapon_fire_chance} info="0%🔥" />
            <InfoLabel title={lang.warship_artillery_main_weight} info={`${AP.bullet_mass} kg`} />
            <InfoLabel title={lang.warship_weapon_damage} info={`${AP.damage}`} />
            <InfoLabel title={lang.warship_weapon_speed} info={`${AP.bullet_speed} m/s`} />
            <InfoLabel title={lang.warship_weapon_ap_overmatch} info={overmatch} />
          </View>
        )}
      </View>
    </View>
  );
};

const renderSecondary = (secondary: any) => {
  if (!secondary) return null;
  const {distance, slots} = secondary;
  var guns = [];
  for (const gun in slots) guns.push(slots[gun]);
  return (
    <View style={styles.margin}>
      <SectionTitle title={`${lang.warship_artillery_secondary} (${distance} km)`} />
      {guns.map((value, index) => {
        const {burn_probability, bullet_speed, name, gun_rate, damage, type} = value;
        return (
          <View key={index}>
            <Title style={styles.centerText}>{`${type} - ${name}`}</Title>
            <View style={styles.horizontal}>
              <InfoLabel title={lang.warship_weapon_reload} info={Number(60 / gun_rate).toFixed(1) + ' s'} />
              <InfoLabel title={lang.warship_weapon_speed} info={`${bullet_speed} m/s`} />
              {burn_probability == null ? null : <InfoLabel title={lang.warship_weapon_fire_chance} info={`🔥${burn_probability}%`} />}
              <InfoLabel title={lang.warship_weapon_damage} info={damage} />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const renderTorpedo = (torpedoes: any, upgrades: any[]) => {
  if (!torpedoes) return null;
  const {visibility_dist, distance, torpedo_name, reload_time, torpedo_speed, slots, max_damage} = torpedoes;
  let dist = Number(distance).toFixed(1);
  let torps = '';
  for (const torp in slots) torps += slots[torp].guns + ' x ' + slots[torp].barrels + '  ';
  let reactionTime = Number((visibility_dist * 1000) / 2.6 / torpedo_speed).toFixed(1);
  let shortDist = Number(distance * 0.8).toFixed(1);
  let fastestSpeed = Number((torpedo_speed + 5) * 1.05).toFixed(1);
  let reactionTimeP = Number((visibility_dist * 1000) / 2.6 / fastestSpeed).toFixed(1);
  let modifier = upgrades.findIndex(u => u === 4279422896) > -1 ? 0.85 : 1;
  let minReload = Number(reload_time * 0.9 * modifier).toFixed(1);

  return (
    <View style={styles.margin}>
      <SectionTitle title={lang.warship_torpedoes} />
      <View style={styles.horizontal}>
        <InfoLabel title={lang.warship_weapon_reload} info={`${reload_time} - ${minReload} s`} />
        <InfoLabel title={lang.warship_weapon_range} info={`${dist} - ${shortDist} km`} />
        <InfoLabel title={lang.warship_weapon_configuration} info={torps} />
      </View>
      <Title style={styles.centerText}>{`${torpedo_name} (${reactionTime} - ${reactionTimeP}s)`}</Title>
      <View style={styles.horizontal}>
        <InfoLabel title={lang.warship_torpedoes_visible_distance} info={`${visibility_dist} km`} />
        <InfoLabel title={lang.warship_weapon_damage} info={max_damage} />
        <InfoLabel title={lang.warship_weapon_speed} info={`${torpedo_speed} - ${fastestSpeed} kt`} />
      </View>
    </View>
  );
};

const renderAADefense = (anti_aircraft: any) => {
  if (!anti_aircraft) return null;
  const {slots} = anti_aircraft;
  var AAValues = [];
  for (const aa in slots) AAValues.push(slots[aa]);
  return (
    <View style={styles.margin}>
      <SectionTitle title={lang.warship_antiaircraft} />
      {AAValues.map((value, index) => {
        const {avg_damage, name, guns} = value;
        return (
          <View key={index}>
            <Title style={styles.centerText}>{name}</Title>
            <View style={styles.horizontal}>
              <InfoLabel title={lang.warship_weapon_configuration} info={`${guns}x`} />
              <InfoLabel title={lang.warship_weapon_damage} info={`${avg_damage} dps`} />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const renderMobility = (mobility: any, upgrades: any[]) => {
  if (!mobility) return null;
  const {rudder_time, turning_radius, max_speed} = mobility;
  let speedFlag = Number(max_speed * 1.05).toFixed(0);
  let m1 = upgrades.findIndex(u => u === 4267888560) > -1 ? 0.8 : 1;
  let m2 = upgrades.findIndex(u => u === 4257402800) > -1 ? 0.6 : 1;
  let modifier = m1 + m2 - 1;
  let maxRudder = Number(rudder_time * modifier).toFixed(1);
  var rudderMsg = maxRudder === rudder_time ? `${rudder_time} s` : `${rudder_time} - ${maxRudder} s`;

  return (
    <View style={styles.margin}>
      <SectionTitle title={lang.warship_maneuverability} />
      <View style={styles.horizontal}>
        <InfoLabel title={lang.warship_maneuverability_rudder_time} info={rudderMsg} />
        <InfoLabel title={lang.warship_maneuverability_speed} info={`${max_speed} - ${speedFlag} kt`} />
        <InfoLabel title={lang.warship_maneuverability_turning} info={`${turning_radius} m`} />
      </View>
    </View>
  );
};

const renderConcealment = (concealment: any, upgrades: any[]) => {
  if (!concealment) return null;
  const {detect_distance_by_plane, detect_distance_by_ship} = concealment;
  let modifier = upgrades.findIndex(u => u === 4265791408) > -1 ? 0.9 : 1;
  let camouflage = 0.97;
  let deduction = 0.9 * modifier * camouflage;
  let max_ship_concealment = Number(detect_distance_by_ship * deduction).toFixed(1);
  let max_plane_concealment = Number(detect_distance_by_plane * deduction).toFixed(1);

  return (
    <View style={styles.margin}>
      <SectionTitle title={lang.warship_concealment} />
      <View style={styles.horizontal}>
        <InfoLabel title={lang.warship_concealment_detect_by_plane} info={`${detect_distance_by_plane} - ${max_plane_concealment} km`} />
        <InfoLabel title={lang.warship_concealment_detect_by_ship} info={`${detect_distance_by_ship} - ${max_ship_concealment} km`} />
      </View>
    </View>
  );
};

const renderUpgrade = (curr: any) => {
  if (!curr) return null;
  let upgrades = Guard(curr, 'upgrades', null);
  let slots = Guard(curr, 'mod_slots', null);
  if (!upgrades || !slots) return null;
  let clone = copy(upgrades);
  clone.sort((a: number, b: number) => b - a);
  for (let index in clone) {
    let id = clone[index];
    clone[index] = Object.assign(useAppStore.getState().getData(SAVED.consumable)[id]);
  }
  let count = [];
  for (let i = 0; i < slots; i++) count.push(i);

  return (
    <View style={styles.margin}>
      <SectionTitle title={lang.warship_upgrades} />
      <ScrollView horizontal contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
        {count.map(num => {
          let all = clone.filter((u: any) => u.slot == num + 1);
          return (
            <View style={styles.upgradeView} key={num}>
              <Title style={styles.margin}>{`${num + 1}.`}</Title>
              {all.map((item: any) => (
                <WikiIcon key={item.name} item={item} scale={0.8} onPress={() => SafeAction('BasicDetail', {item: item})} />
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const renderNextShip = (next_ships: any) => {
  if (!next_ships || Object.keys(next_ships).length == 0) return null;
  var ships = [];
  for (const key in next_ships) ships.push({key: key, exp: next_ships[key]});
  return (
    <View style={styles.margin}>
      <SectionTitle title={lang.warship_next_ship} />
      <FlatList
        data={ships}
        horizontal
        keyExtractor={(item: any) => String(item.key)}
        renderItem={({item}) => {
          let curr = useAppStore.getState().getData(SAVED.warship)[item.key];
          return (
            <WarshipCell
              scale={1.4} item={curr}
              onPress={() => { Actions.pop(); SafeAction('WarshipDetail', {item: curr}, 1); }}
            />
          );
        }}
      />
    </View>
  );
};

const renderAll = (curr: any, upgrades: any[]) => {
  let module = Guard(curr, 'modules', {});
  let hasModule = false;
  for (let id in module) {
    if (module[id].length > 1) { hasModule = true; break; }
  }

  return (
    <View>
      {renderStatus(Guard(curr, 'default_profile', null))}
      {hasModule ? (
        <Button theme={{roundness: 0}} mode="contained" onPress={() => SafeAction('WarshipModule', {data: curr})}>
          {lang.warship_update_module}
        </Button>
      ) : null}
      {renderSurvivability(curr)}
      {renderMainBattery(Guard(curr, 'default_profile.artillery', null), upgrades)}
      {renderSecondary(Guard(curr, 'default_profile.atbas', null))}
      {renderTorpedo(Guard(curr, 'default_profile.torpedoes', null), upgrades)}
      {renderAADefense(Guard(curr, 'default_profile.anti_aircraft', null))}
      {renderMobility(Guard(curr, 'default_profile.mobility', null), upgrades)}
      {renderConcealment(Guard(curr, 'default_profile.concealment', null), upgrades)}
      {renderUpgrade(curr)}
      {renderNextShip(Guard(curr, 'next_ships'))}
    </View>
  );
};

const renderSimilar = (similar: any[], compare: any, onShipPress: (item: any) => void) => {
  if (Object.keys(similar).length === 0) return null;
  return (
    <FooterPlus>
      <FlatList
        keyExtractor={item => String(item.ship_id)}
        horizontal
        data={similar}
        renderItem={({item}) => (
          <WarshipCell
            item={item} scale={1.4}
            onPress={() => onShipPress(item)}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
      {compare != null ? (
        <Button onPress={() => SafeAction('SimilarGraph', {info: compare})}>
          {lang.warship_compare_similar}
        </Button>
      ) : null}
    </FooterPlus>
  );
};

const efficientDataRequest = async (id: string, server: string, onData: (d: any) => void) => {
  const json = await SafeFetch.get(WoWsAPI.ShipWiki, server, id, langStr());
  const data = Guard(json, 'data', {});
  onData(data);
};

const getNewModule = (data: any, server: string) => {
  const {ship_id, module} = data;
  const {Artillery, DiveBomber, Engine, Fighter, FlightControl, Hull, Suo, TorpedoBomber, Torpedoes} = module;
  return SafeFetch.get(WoWsAPI.ShipModule, server, ship_id, Artillery, DiveBomber, Engine, Fighter, Suo, FlightControl, Hull, TorpedoBomber, Torpedoes, langStr());
};

const buildCharts = (similar: any[]) => {
  let damageChart: any[] = [];
  let winrateChart: any[] = [];
  let fragChart: any[] = [];
  for (let ship of similar) {
    let overall = useAppStore.getState().getData(SAVED.pr)[ship.ship_id];
    if (overall == null) continue;
    const {average_damage_dealt, average_frags, win_rate} = overall;
    let name = ship.name;
    damageChart.push({x: name, y: roundTo(average_damage_dealt)});
    winrateChart.push({x: name, y: roundTo(win_rate, 1)});
    fragChart.push({x: name, y: roundTo(average_frags, 2)});
  }
  let data = [
    {n: lang.warship_avg_damage, d: damageChart, c: '#2387FF'},
    {n: lang.warship_avg_winrate, d: winrateChart, c: '#4DA74D'},
    {n: lang.warship_avg_frag, d: fragChart, c: '#C94A4D'},
  ];
  return data.map(c => {
    let names = c.d.map((v: any) => v.x);
    let values = c.d.map((v: any) => v.y);
    return (
      <View key={c.n}>
        <SectionTitle center title={c.n} />
        <HorizontalBarChart
          style={{height: names.length * 20}}
          chartData={values}
          xAxisLabels={names}
          darkMode={useAppStore.getState().isDarkMode}
          themeColor={c.c}
        />
      </View>
    );
  });
};

const WarshipDetail = ({route}: any) => {
  const server = useMemo(() => getCurrDomain(), []);
  const currParam = route?.params?.item;

  const {curr: initialCurr, similar: initialSimilar} = useMemo(() => {
    let warship = useAppStore.getState().getData(SAVED.warship);
    let similar = Object.entries(warship).filter((s: any) =>
      s[1].tier === currParam?.tier && s[1].type === currParam?.type && s[1].ship_id != currParam?.ship_id
    );
    similar.forEach((s: any, i: number) => (similar[i] = Object.assign(s[1])));
    return {curr: currParam, similar};
  }, [currParam]);

  const [curr, setCurr] = useState(initialCurr);
  const [similar] = useState(initialSimilar);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const [compare, setCompare] = useState<any>(false);
  const [module, setModule] = useState<any>(null);
  const upgradesRef = useRef<any[]>([]);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const fetchData = useCallback((id: string) => {
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await efficientDataRequest(id, server, (result: any) => {
        const upgrades = Guard(result[id], 'upgrades', []);
        upgradesRef.current = upgrades;
        setData(result[id]);
        setLoading(false);
      });
    }, 1000);
  }, [server]);

  useEffect(() => {
    if (curr?.ship_id) fetchData(curr.ship_id);
  }, [curr?.ship_id]);

  useEffect(() => {
    if (similar.length > 0) {
      const charts = buildCharts(similar);
      setCompare(charts);
    }
  }, [similar]);

  useEffect(() => {
    const {module: m} = route?.params ?? {};
    if (m) {
      if (m === module) return;
      setModule(m);
      (async () => {
        setLoading(true);
        const json = await getNewModule(m, server);
        const newModule = Guard(json, `data.${m.ship_id}`, null);
        if (newModule) {
          const newData = Object.assign(data);
          delete newData.default_profile;
          newData.default_profile = newModule;
          setData(newData);
          setLoading(false);
        }
      })();
    }
  }, [route?.params?.module]);

  if (!curr) return null;

  return (
    <WoWsInfo title={`${curr.ship_id_str} ${curr.ship_id}`}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Anime.View animation="pulse" iterationCount="infinite" useNativeDriver>
          <WikiIcon warship item={curr} scale={3} />
        </Anime.View>
        {loading ? <LoadingIndicator /> : (
          <View>
            {renderBasic(curr, data)}
            {renderAll(curr, upgradesRef.current)}
          </View>
        )}
      </ScrollView>
      {renderSimilar(similar, compare, (item: any) => {
        setCurr(item);
        fetchData(item.ship_id);
      })}
    </WoWsInfo>
  );
};

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center'},
  shipTitle: {fontSize: 24},
  modelBtn: {marginTop: 8},
  margin: {margin: 8},
  centerText: {textAlign: 'center'},
  weaponTitle: {textAlign: 'center', margin: -16},
  upgradeView: {alignItems: 'center'},
  horizontal: {flexDirection: 'row', flex: 1, justifyContent: 'space-around'},
  graphTitle: {alignSelf: 'center', padding: 8, paddingBottom: 0},
});

export {WarshipDetail};
