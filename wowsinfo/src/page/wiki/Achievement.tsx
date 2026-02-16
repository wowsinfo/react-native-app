/**
 * Achievement.js
 *
 * This is the wiki achievements
 */

import React, {PureComponent} from 'react';
import {FlatGrid} from 'react-native-super-grid';
import {WikiIcon, WoWsInfo} from '../../component';
import {SAVED, setLastLocation} from '../../value/data';
import {SafeAction} from '../../core';

interface AchievementItem {
  hidden: boolean;
  name: string;
  description: string;
  achievement_id: string;
  image: string;
  image_inactive?: string;
}

interface AchievementState {
  data: AchievementItem[];
}

class Achievement extends PureComponent<{}, AchievementState> {
  constructor(props: {}) {
    super(props);
    setLastLocation('Achievement');
    console.log('WIKI - Achievement');
    let achievement = AppGlobalData.get(SAVED.achievement);
    let sorted: [string, any][] = Object.entries(achievement).sort((a, b) => {
      // Sort by hidden then by key
      if (a[1].hidden === b[1].hidden) {
        return a[0].localeCompare(b[0]);
      } else {
        return a[1].hidden - b[1].hidden;
      }
    });

    let sortedData: AchievementItem[] = [];
    sorted.forEach((item) => {
      // Make it an object
      sortedData.push(Object.assign(item[1]));
    });
    console.log(sortedData);

    this.state = {
      data: sortedData,
    };
  }

  render() {
    const {data} = this.state;
    return (
      <WoWsInfo>
        <FlatGrid
          itemDimension={80}
          data={data}
          renderItem={({item}) => {
            return (
              <WikiIcon
                item={item}
                onPress={() => SafeAction('BasicDetail', {item: item})}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      </WoWsInfo>
    );
  }
}

export {Achievement};
