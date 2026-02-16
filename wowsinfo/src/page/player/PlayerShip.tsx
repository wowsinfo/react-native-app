import React, {PureComponent} from 'react';
import {FlatList} from 'react-native';
import {
  WoWsInfo,
  WarshipCell,
  Touchable,
  RatingButton,
  FooterPlus,
  SimpleRating,
} from '../../component';
import {
  getOverallRating,
  SafeAction,
  filterShip,
  Guard,
  getColour,
  bestCellWidth,
  bestCellWidthEven,
} from '../../core';
import {FlatGrid} from 'react-native-super-grid';
import {SAVED} from '../../value/data';
import {lang} from '../../value/lang';
import {Button, withTheme} from 'react-native-paper';

interface ShipData {
  ship_id: number;
  last_battle_time: number;
  pvp: any;
  avgDmg?: number;
  avgWinrate?: number;
  avgFrags?: number;
  rating?: number;
  ap?: number;
}

interface PlayerShipProps {
  data: ShipData[];
  rating?: number;
  filter?: any;
  theme: any;
}

interface PlayerShipState {
  data: ShipData[];
  rating: number;
  filter: any;
  sortStr: string;
}

class PlayerShip extends PureComponent<PlayerShipProps, PlayerShipState> {
  private original: ShipData[];

  constructor(props: PlayerShipProps) {
    super(props);

    let ships = props.data;
    let rating = props.rating;
    if (rating == null) {
      // Prevent unnessary
      rating = getOverallRating(ships);
    }
    console.log(ships);

    this.original = ships.sort(
      (a, b) => b.last_battle_time - a.last_battle_time,
    );
    this.state = {
      data: this.original,
      rating: rating,
      filter: {},
      sortStr: '',
    };
  }

  componentDidUpdate(): void {
    const {filter} = this.props;
    if (filter) {
      // Prevent repetitive update
      if (filter === this.state.filter) {
        this.setState({rating: getOverallRating(this.state.data)});
        return;
      }
      this.setState({filter: filter});
      this.updateShip(filter);
    }
  }

  render(): JSX.Element {
    const {data, rating} = this.state;
    const sortingMethod = [
      {n: lang.ship_sort_battle, v: 'pvp.battles'},
      {n: lang.warship_avg_damage, v: 'avgDmg'},
      {n: lang.warship_avg_winrate, v: 'avgWinrate'},
      {n: lang.warship_avg_frag, v: 'avgFrags'},
      {n: lang.ship_sort_colour, v: 'rating'},
      {n: 'AP', v: 'ap'},
      {n: lang.basic_last_battle, v: 'last_battle_time'},
      {n: lang.record_max_damage_dealt, v: 'pvp.max_damage_dealt'},
      {n: lang.record_max_xp, v: 'pvp.max_xp'},
      {n: lang.record_max_frags_battle, v: 'pvp.max_frags_battle'},
    ];

    const ratingColor = getColour(rating);
    this.props.theme.colors.primary = ratingColor;
    const cellWidth = bestCellWidthEven(160);

    return (
      <WoWsInfo
        hideAds
        title={`${lang.wiki_warship_footer} - ${data.length}`}
        onPress={() =>
          SafeAction('WarshipFilter', {applyFunc: this.updateShip})
        }>
        <RatingButton rating={rating} />
        <FlatGrid
          itemDimension={cellWidth}
          spacing={0}
          data={data}
          renderItem={({item}) => this.renderShip(item)}
          showsVerticalScrollIndicator={false}
        />
        <FooterPlus>
          <FlatList
            data={sortingMethod}
            renderItem={({item}) => (
              <Button
                style={{margin: 8}}
                mode="contained"
                onPress={() => this.sortData(item.v)}>
                {item.n}
              </Button>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={d => d.n}
          />
        </FooterPlus>
      </WoWsInfo>
    );
  }

  sortData(v: string): void {
    const {data, sortStr} = this.state;
    console.log(sortStr, v);
    if (v === sortStr) {
      // Simply reverse it
      this.setState({data: data.reverse(), sortStr: ''});
    } else {
      this.setState({
        data: data.sort((a, b) => Guard(b, v, 0) - Guard(a, v, 0)),
        sortStr: v,
      });
    }
  }

  renderShip(item: ShipData): JSX.Element {
    let ship = AppGlobalData.get(SAVED.warship)[item.ship_id];
    return (
      <Touchable
        key={item.ship_id}
        onPress={() => SafeAction('PlayerShipDetail', {data: item})}>
        <WarshipCell item={ship} scale={2} />
        <SimpleRating info={item} />
      </Touchable>
    );
  }

  updateShip(data: any): void {
    let sorted = filterShip(data, this.original);
    if (sorted == null) {
      this.setState({data: this.original});
    } else {
      // Get rating again
      let rating = getOverallRating(sorted);
      this.setState({data: sorted, rating: rating});
    }
  }
}

export default withTheme(PlayerShip);
