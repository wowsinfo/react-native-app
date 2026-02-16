/**
 * Warship.js
 *
 * This is wiki warship
 */

import React, {PureComponent} from 'react';
import {WoWsInfo, WarshipCell} from '../../component';
import {FlatGrid} from 'react-native-super-grid';
import {SAVED, setLastLocation} from '../../value/data';
import {lang} from '../../value/lang';
import {SafeAction, filterShip, bestCellWidthEven} from '../../core';
import {WarshipFilterData} from './WarshipFilter';

interface WarshipItem {
  ship_id: number;
  tier: number;
  type: string;
  new?: boolean;
  name: string;
  nation: string;
}

interface WarshipProps {
  filter?: WarshipFilterData;
}

interface WarshipState {
  data: WarshipItem[];
  filter: WarshipFilterData | {};
}

class Warship extends PureComponent<WarshipProps, WarshipState> {
  original: WarshipItem[];

  constructor(props: WarshipProps) {
    super(props);
    setLastLocation('Warship');
    console.log('WIKI - Warship');
    let warship = AppGlobalData.get(SAVED.warship);
    let sorted: [string, any][] = Object.entries(warship).sort((a, b) => {
      // Sort by tier, then by type
      if (a[1].new) {
        return -1;
      }
      if (b[1].new) {
        return 1;
      }
      if (a[1].tier === b[1].tier) {
        return a[1].type.localeCompare(b[1].type);
      } else {
        return b[1].tier - a[1].tier;
      }
    });

    // Remove extra information (ship id)
    let sortedData: WarshipItem[] = [];
    sorted.forEach(s => sortedData.push(Object.assign(s[1])));
    this.original = sortedData;
    console.log(sortedData);

    this.state = {
      data: sortedData,
      filter: {},
    };
  }

  componentDidUpdate() {
    const {filter} = this.props;
    if (filter) {
      // Prevent repetitive update
      if (filter === this.state.filter) {
        return;
      }
      this.setState({filter: filter});
      this.updateShip(filter);
    }
  }

  render() {
    const {data} = this.state;

    const width = bestCellWidthEven(160);
    return (
      <WoWsInfo
        title={`${lang.wiki_warship_footer} - ${data.length}`}
        onPress={() =>
          SafeAction('WarshipFilter', {applyFunc: this.updateShip})
        }>
        <FlatGrid
          itemDimension={width}
          spacing={0}
          data={data}
          renderItem={({item}: {item: WarshipItem}) => {
            return (
              <WarshipCell
                scale={width / 80}
                key={item.ship_id}
                item={item}
                onPress={() => SafeAction('WarshipDetail', {item: item})}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
          fixed
        />
      </WoWsInfo>
    );
  }

  updateShip = (data: WarshipFilterData) => {
    let sorted = filterShip(data);
    if (sorted == null) {
      this.setState({data: this.original});
    } else {
      this.setState({data: sorted});
    }
  };
}

export {Warship};
