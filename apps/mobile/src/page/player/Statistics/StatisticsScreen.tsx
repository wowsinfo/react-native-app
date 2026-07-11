import React, {Component} from 'react';
import {View, ScrollView, StyleSheet, Linking} from 'react-native';
import {Text, IconButton, Title, Button, withTheme} from 'react-native-paper';
import {
  LoadingIndicator,
  WoWsInfo,
  FooterPlus,
  TabButton,
  InfoLabel,
  SectionTitle,
  PlayerRecord,
  DetailedInfo,
  RatingButton,
} from '../../../component';
import {
  SafeFetch,
  Guard,
  humanTimeString,
  SafeAction,
  SafeStorage,
  getOverallRating,
  getColour,
} from '../../../core';
import {WoWsAPI} from '../../../value/api';
import {getDomain, getPrefix, LOCAL, setLastLocation} from '../../../value/data';
import {TintColour} from '../../../value/colour';
import {lang} from '../../../value/lang';


class Statistics extends Component {
  constructor(props) {
    super(props);
    setLastLocation('Statistics');
    let ID = Guard(props, 'route.params.info.account_id', null);
    // ID must be valid
    if (ID != null && ID !== '') {
      const {account_id, nickname, server} = props.route?.params?.info ?? {};
      // Check if this player is inside friend list
      let friend = AppGlobalData.get(LOCAL.friendList);
      let master = AppGlobalData.get(LOCAL.userInfo);
      console.log(master, account_id);
      this.state = {
        name: nickname,
        id: account_id,
        server: server,
        // Valid data or hidden account
        valid: true,
        hidden: false,
        // Master account
        canBeMaster: master.account_id != account_id,
        // Add to friend
        canBeFriend: friend.player[account_id] == null,
        clan: '',
        currRank: 0,
        rating: 0,
        // To check if certain data have been loaded correctly
        achievement: false,
        rank: false,
        rankShip: false,
        ship: false,
        basic: false,
        graph: false,
        // Whether show everything
        showMore: false,
        ratingColor: '#607D8B',
      };

      // Save domain
      this.domain = getDomain(server);
      this.prefix = getPrefix(server);
      console.log(this.domain);

      if (this.domain != null) {
        this.getBasic();
        this.getRank();
        this.getClan();
        this.getShip();
        this.getAchievement();
      } else {
        // Invalid domain
        this.setState({valid: false});
      }
    } else {
      this.state = {
        id: null,
        valid: false,
      };
    }
  }

  componentWillUnmount() {
    // reset the theme colour back
    this.props.theme.colors.primary = TintColour()[500];
  }

  /**
   * Get basic player info
   */
  async getBasic() {
    const {server, id} = this.state;
    const data = await SafeFetch.get(WoWsAPI.PlayerInfo, getDomain(server), id);
    const hidden = Guard(data, 'meta.hidden', null);
    let hiddenAccount = false;
    if (hidden != null) {
      hiddenAccount = true;
      this.setState({hidden: true});
    }
    const player = Guard(data, `data.${id}`, null);
    if (player == null) {
      this.setState({valid: false});
    } else {
      const battle = Guard(player, 'statistics.pvp.battles', 0);
      if (!hiddenAccount && battle == 0) {
        this.setState({hidden: true});
      }
      this.setState({basic: player});
    }
  }

  async getClan() {
    const {id} = this.state;
    const data = await SafeFetch.get(WoWsAPI.PlayerClan, this.domain, id);
    const tag = Guard(data, `data.${id}.clan.tag`, '');
    if (tag !== '') {
      this.setState({clan: tag});
    }
  }

  async getAchievement() {
    const {id} = this.state;
    const data = await SafeFetch.get(WoWsAPI.PlayerAchievement, this.domain, id);
    const achievement = Guard(data, `data.${id}.battle`, null);
    if (achievement != null) {
      this.setState({achievement});
    }
  }

  async getRank() {
    const {id} = this.state;
    const rankData = await SafeFetch.get(WoWsAPI.RankInfo, this.domain, id);
    const rank = Guard(rankData, `data.${id}.seasons`, null);
    if (rank != null) {
      const keys = Object.keys(rank);
      if (keys.length > 0) {
        const last = keys.slice(-1)[0];
        const currRank = Guard(rank[last], 'rank_info.rank', 0);
        if (currRank > 0) {
          this.setState({currRank});
        }
      }
      this.setState({rank});
    }

    const shipData = await SafeFetch.get(WoWsAPI.RankShipInfo, this.domain, id);
    const ships = Guard(shipData, `data.${id}`, null);
    if (ships != null) {
      const formatted: any = {};
      for (const ship of ships) {
        const {seasons, ship_id} = ship;
        for (const season in seasons) {
          if (formatted[season] == null) formatted[season] = [];
          const curr = seasons[season];
          const {rank_solo, rank_div2, rank_div3} = curr;
          if (rank_solo) { curr.pvp = curr.rank_solo; delete curr.rank_solo; }
          else if (rank_div2) { curr.pvp = curr.rank_div2; delete curr.rank_div2; }
          else if (rank_div3) { curr.pvp = curr.rank_div3; delete curr.rank_div3; }
          else continue;
          curr.ship_id = ship_id;
          formatted[season].push(curr);
        }
      }
      this.setState({rankShip: formatted});
    }
  }

  async getShip() {
    const {id} = this.state;
    const data = await SafeFetch.get(WoWsAPI.ShipInfo, this.domain, id);
    const ship = Guard(data, `data.${id}`, null);
    if (ship != null) {
      const rating = getOverallRating(ship);
      this.setState({ship, rating, graph: ship, ratingColor: getColour(rating)});
    }
  }

  render() {
    const {error, container, footer} = styles;
    const {
      name,
      id,
      valid,
      achievement,
      rank,
      rankShip,
      basic,
      ship,
      graph,
      ratingColor,
    } = this.state;

    console.log(this.state);
    if (id == null || id === '') {
      // Show an error page or if it is from home, ask user to add an account first
      return (
        <WoWsInfo style={error}>
          <Text>BUG</Text>
        </WoWsInfo>
      );
    } else if (!valid) {
      // Not valid (API or Internet error)
      return (
        <WoWsInfo style={container}>
          <Text>{'Data is not valid\nPlease try again later'}</Text>
        </WoWsInfo>
      );
    } else {
      this.props.theme.colors.primary = ratingColor;

      return (
        <WoWsInfo
          style={container}
          title={`- ${id} -`}
          onPress={() =>
            Linking.openURL(
              `https://${this.prefix}.wows-numbers.com/player/${id},${name}/`,
            )
          }>
          <ScrollView>{this.renderBasic(basic)}</ScrollView>
          <FooterPlus style={footer}>
            {this.renderAchievement(achievement)}
            {this.renderGraph(graph)}
            {this.renderShip(ship)}
            {this.renderRank(rank, rankShip)}
          </FooterPlus>
        </WoWsInfo>
      );
    }
  }

  ///
  // I will do parallel data loading so each of them will have
  // their own state to check if the button could be rendered
  ///

  renderBasic(basic) {
    const {container, horizontal, playerName, level} = styles;
    if (!basic) {
      const {name} = this.state;
      return (
        <View style={container}>
          <Title style={playerName}>{name}</Title>
          <LoadingIndicator />
        </View>
      );
    } else {
      const {created_at, leveling_tier, last_battle_time, nickname} = basic;
      const {hidden, clan, currRank, canBeFriend, canBeMaster, rating} =
        this.state;

      let register = humanTimeString(created_at);
      let lastBattle = humanTimeString(last_battle_time);
      if (hidden) {
        return (
          <View style={container}>
            <View style={horizontal}>
              <SectionTitle title={nickname} style={playerName} />
              <IconButton
                icon="https"
                size={24}
                style={{alignSelf: 'center'}}
              />
            </View>
            <View style={styles.hidden}>
              {canBeFriend ? (
                <Button icon="contacts" onPress={this.addFriend}>
                  {lang.basic_add_friend}
                </Button>
              ) : null}
              <InfoLabel
                left
                title={lang.basic_register_date}
                info={register}
              />
              <InfoLabel
                left
                title={lang.basic_last_battle}
                info={lastBattle}
              />
              <InfoLabel
                left
                title={lang.basic_level_tier}
                info={lang.basic_data_unknown}
              />
            </View>
          </View>
        );
      } else {
        let name = nickname;
        if (clan !== '') {
          name = `[${clan}]\n${nickname}`;
        }
        let extraInfo = `Lv ${leveling_tier}`;
        if (currRank > 0) {
          extraInfo += ` | ⭐${currRank}`;
        }
        return (
          <View style={container}>
            <RatingButton rating={rating} />
            <Title style={playerName}>{name}</Title>
            <Text style={level}>{extraInfo}</Text>
            <View style={horizontal}>
              <InfoLabel title={lang.basic_register_date} info={register} />
              <InfoLabel title={lang.basic_last_battle} info={lastBattle} />
            </View>
            <View style={{padding: 4}}>
              {canBeFriend ? (
                <Button icon="contacts" onPress={this.addFriend}>
                  {lang.basic_add_friend}
                </Button>
              ) : null}
              {canBeMaster ? (
                <Button icon="heart" onPress={this.setMainAccount}>
                  {lang.basic_set_main}
                </Button>
              ) : null}
            </View>
            {this.renderStatistics(basic.statistics)}
          </View>
        );
      }
    }
  }

  getPlayerInfo() {
    const {account_id, nickname, server} = this.props.route?.params?.info ?? {};
    return {nickname: nickname, account_id: account_id, server: server};
  }

  setMainAccount = () => {
    let info = this.getPlayerInfo();
    AppGlobalData.set(LOCAL.userInfo, info);
    SafeStorage.set(LOCAL.userInfo, info);
    this.setState({canBeMaster: false});
  };

  addFriend = () => {
    let info = this.getPlayerInfo();

    // Update object
    let str = LOCAL.friendList;
    AppGlobalData.get(str).player[info.account_id] = info;

    SafeStorage.set(str, AppGlobalData.get(str));
    this.setState({canBeFriend: false});
  };

  renderStatistics(statistics) {
    if (!statistics) {
      return null;
    }
    const {showMore} = this.state;
    return (
      <View style={{paddingBottom: 8}}>
        <DetailedInfo data={statistics} more={showMore} />
        <PlayerRecord data={statistics.pvp} />
      </View>
    );
  }

  renderAchievement(achievement) {
    let loading = true;
    if (achievement && Object.keys(achievement).length > 0) {
      loading = false;
    }
    return (
      <TabButton
        icon={{uri: 'AchievementTab'}}
        disabled={loading}
        onPress={() => SafeAction('PlayerAchievement', {data: achievement})}
      />
    );
  }

  renderShip(ship) {
    let loading = true;
    if (ship && ship.length > 0) {
      loading = false;
    }

    return (
      <TabButton
        icon={{uri: 'Ship'}}
        disabled={loading}
        onPress={() => SafeAction('PlayerShip', {data: ship}, 1)}
      />
    );
  }

  renderRank(rank, rankShip) {
    let loading = true;
    if (rank && rankShip) {
      loading = false;
    }

    return (
      <TabButton
        icon={{uri: 'Rank'}}
        disabled={loading}
        onPress={() => SafeAction('Rank', {data: rank, ship: rankShip})}
      />
    );
  }

  renderGraph(graph) {
    let loading = true;
    if (graph && graph.length > 0) {
      loading = false;
    }
    const {hidden} = this.state;

    return (
      <TabButton
        icon={{uri: 'Graph'}}
        disabled={loading || hidden}
        onPress={() => SafeAction('Graph', {data: graph})}
      />
    );
  }
}

const styles = StyleSheet.create({
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenProfile: {},
  container: {
    flex: 1,
  },
  horizontal: {
    flexDirection: 'row',
  },
  playerName: {
    alignSelf: 'center',
    fontSize: 32,
    fontWeight: '500',
    paddingTop: 32,
    paddingBottom: 8,
    textAlign: 'center',
  },
  level: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  hidden: {
    paddingLeft: 16,
    alignItems: 'flex-start',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default withTheme(Statistics);
