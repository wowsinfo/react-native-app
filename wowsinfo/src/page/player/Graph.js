import React, {PureComponent} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {BarChart, PieChart} from 'native-chart-experiment';
import {WoWsInfo} from '../../component';
import {SAVED} from '../../value/data';
import {SafeValue, roundTo} from '../../core';
import {TintColour} from '../../value/colour';

class Graph extends PureComponent {
  constructor(props) {
    super(props);
    const {data} = this.props;
    console.log(data);

    let tierInfo = {};
    let nationInfo = {};
    let typeInfo = {};
    let totalBattle = 0;
    for (let ship of data) {
      // Get info we need
      const {pvp, ship_id} = ship;
      const {battles} = pvp;

      let curr = AppGlobalData.get(SAVED.warship)[ship_id];
      if (curr == null) {
        continue;
      }

      const {nation, tier, type} = curr;
      tierInfo[tier] = SafeValue(tierInfo[tier], 0) + battles;
      nationInfo[nation] = SafeValue(nationInfo[nation], 0) + battles;
      typeInfo[type] = SafeValue(typeInfo[type], 0) + battles;
      totalBattle += battles;
    }

    this.state = {
      tier: this.objToChart(tierInfo),
      avgTier: this.getAvgTier(tierInfo),
      nation: this.objToChart(
        nationInfo,
        AppGlobalData.get(SAVED.encyclopedia).ship_nations,
        10,
      ),
      type: this.objToChart(
        typeInfo,
        AppGlobalData.get(SAVED.encyclopedia).ship_types,
      ),
    };
  }

  objToChart(obj, name, min = 0) {
    // Key will be x and Value will be y
    let chart = {x: [], y: []};
    for (let key in obj) {
      let val = obj[key];
      if (val === 0 || val < min) {
        continue;
      }

      let label = key;
      if (name) {
        label = name[key];
      }

      chart.x.push(label);
      chart.y.push(val);
    }
    console.log(chart);
    return chart;
  }

  getAvgTier = tier => {
    let weight = 0;
    let total = 0;
    for (let key in tier) {
      let curr = tier[key];
      weight += curr * Number(key);
      total += curr;
    }
    return roundTo(weight / total, 1);
  };

  render() {
    const {tier, nation, type} = this.state;
    return (
      <WoWsInfo hideAds>
        <ScrollView>
          {/* <Title style={{textAlign: 'center'}}>{`Average Tier - ${avgTier}`}</Title> */}
          <BarChart
            style={{height: 300}}
            darkMode={AppGlobalData.isDarkMode}
            themeColor={TintColour()[500]}
            chartData={tier.y}
            xAxisLabels={tier.x}
          />
          <PieChart
            style={{height: 300}}
            darkMode={AppGlobalData.isDarkMode}
            chartData={nation.y}
            dataLabels={nation.x}
          />
          <PieChart
            style={{height: 300}}
            darkMode={AppGlobalData.isDarkMode}
            chartData={type.y}
            dataLabels={type.x}
          />
        </ScrollView>
      </WoWsInfo>
    );
  }
}

export {Graph};
