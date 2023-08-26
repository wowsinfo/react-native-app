import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import {WoWsInfo, Touchable, Info6Icon} from '../../component';
import {lang} from '../../value/lang';
import {FlatGrid} from 'react-native-super-grid';
import {Headline, Title} from 'react-native-paper';
import {SafeAction} from '../../core';

class Rank extends PureComponent {
  constructor(props) {
    super(props);
    let list = [];
    console.log(props);
    for (let key in props.data) {
      let curr = props.data[key];
      curr.season = Number(key);
      list.push(curr);
    }
    list.reverse();

    this.state = {
      data: list,
      ship: props.ship,
    };

    // Request ship info
    // this.domain =
    // SafeFetch.get(WoWsAPI.RankShipInfo, )
  }

  render() {
    const {centerText} = styles;
    const {data, ship} = this.state;
    if (data == null || data.length == 0) return null;

    console.log(data);
    return (
      <WoWsInfo title={`${lang.tab_rank_title} - ${data.length}`}>
        <FlatGrid
          itemDimension={300}
          data={data}
          renderItem={({item}) => {
            const {season} = item;
            const shipData = ship[season];
            console.log(shipData);

            // let emoji = '⭐';

            return (
              <Touchable
                onPress={
                  shipData == null || shipData.length == 0
                    ? null
                    : () => SafeAction('PlayerShip', {data: shipData})
                }
                style={{margin: 8}}>
                <Headline
                  style={
                    centerText
                  }>{`- ${lang.rank_season_title} ${season} -`}</Headline>
                {/* <Title style={centerText}>{`${emoji} ${rank} ${emoji}`}</Title> */}
                <View>{this.renderSeasonInfo(item)}</View>
              </Touchable>
            );
          }}
          spacing={0}
        />
      </WoWsInfo>
    );
  }

  renderSeasonInfo(data) {
    if (data == null) return null;
    // find the other key which is not season
    const rank_key = Object.keys(data).find(key => key != 'season');
    if (rank_key == null) return null;
    const {rank_solo, rank_div2, rank_div3} = data[rank_key];
    let info = rank_solo;
    if (info == null) info = rank_div2;
    if (info == null) info = rank_div3;
    if (info == null) return null;
    return <Info6Icon data={info} compact />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  centerText: {
    alignSelf: 'center',
    textAlign: 'center',
  },
});

export {Rank};
