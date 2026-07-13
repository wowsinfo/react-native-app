import React, {useMemo} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {BarChart, PieChart} from 'native-chart-experiment';
import {WoWsInfo} from '../../component';
import {SAVED} from '../../value/data';
import {SafeValue, roundTo} from '../../core';
import {TintColour} from '../../value/colour';
import {useAppStore} from '../../store/useAppStore';

const objToChart = (obj: any, name?: any, min = 0) => {
  let chart: any = {x: [], y: []};
  for (let key in obj) {
    let val = obj[key];
    if (val === 0 || val < min) continue;
    let label = name ? name[key] : key;
    chart.x.push(label);
    chart.y.push(val);
  }
  return chart;
};

const getAvgTier = (tier: any) => {
  let weight = 0;
  let total = 0;
  for (let key in tier) {
    let curr = tier[key];
    weight += curr * Number(key);
    total += curr;
  }
  return roundTo(weight / total, 1);
};

const Graph = ({route}: any) => {
  const {data} = route?.params ?? {};

  const {tier, nation, type} = useMemo(() => {
    let tierInfo: any = {};
    let nationInfo: any = {};
    let typeInfo: any = {};
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
      nation: objToChart(nationInfo, useAppStore.getState().getData(SAVED.encyclopedia).ship_nations, 10),
      type: objToChart(typeInfo, useAppStore.getState().getData(SAVED.encyclopedia).ship_types),
    };
  }, [data]);

  const darkMode = useAppStore.getState().isDarkMode;
  const themeColor = TintColour()[500];

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
