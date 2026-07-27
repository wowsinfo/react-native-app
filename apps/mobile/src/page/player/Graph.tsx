import React, {useMemo} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {BarChart, PieChart} from 'native-chart-experiment';
import {WoWsInfo} from '../../component';
import {SAVED} from '../../value/data';
import {SafeValue, roundTo} from '../../core';
import {getTintColour} from '../../value/colour';
import {useAppStore} from '../../store/useAppStore';

const objToChart = (obj: Record<string, unknown>, name?: Record<string, unknown>, min = 0) => {
  let chart: {x: unknown[]; y: unknown[]} = {x: [], y: []};
  for (let key in obj) {
    let val = obj[key];
    if (val === 0 || val < min) continue;
    let label = name ? name[key] : key;
    chart.x.push(label);
    chart.y.push(val);
  }
  return chart;
};

const getAvgTier = (tier: Record<string, unknown>) => {
  let weight = 0;
  let total = 0;
  for (let key in tier) {
    let curr = tier[key];
    weight += curr * Number(key);
    total += curr;
  }
  return roundTo(weight / total, 1);
};

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@wowsinfo/shared';

const Graph = ({route}: NativeStackScreenProps<RootStackParamList, 'Graph'>) => {
  const {data} = route?.params ?? {};

  const {tier, nation, type} = useMemo(() => {
    let tierInfo: Record<string, unknown> = {};
    let nationInfo: Record<string, unknown> = {};
    let typeInfo: Record<string, unknown> = {};
    for (let ship of data ?? []) {
      const {pvp, ship_id} = ship;
      const {battles} = pvp;
      let curr = useAppStore.getState().getData(SAVED.warship)[ship_id];
      if (curr == null) continue;
      const {nation, tier, type} = curr;
      tierInfo[tier] = SafeValue(tierInfo[tier], 0) + battles;
      nationInfo[nation] = SafeValue(nationInfo[nation], 0) + battles;
      typeInfo[type] = SafeValue(typeInfo[type], 0) + battles;
    }
    return {
      tier: objToChart(tierInfo),
      nation: objToChart(
        nationInfo,
        useAppStore.getState().getData(SAVED.encyclopedia).ship_nations,
        10,
      ),
      type: objToChart(
        typeInfo,
        useAppStore.getState().getData(SAVED.encyclopedia).ship_types,
      ),
    };
  }, [data]);

  const darkMode = useAppStore.getState().isDarkMode;
  const themeColor = getTintColour()[500];

  return (
    <WoWsInfo hideAds>
      <ScrollView>
        <BarChart
          style={{height: 300}}
          darkMode={darkMode}
          themeColor={themeColor}
          chartData={tier.y}
          xAxisLabels={tier.x}
        />
        <PieChart
          style={{height: 300}}
          darkMode={darkMode}
          chartData={nation.y}
          dataLabels={nation.x}
        />
        <PieChart
          style={{height: 300}}
          darkMode={darkMode}
          chartData={type.y}
          dataLabels={type.x}
        />
      </ScrollView>
    </WoWsInfo>
  );
};

export {Graph};
