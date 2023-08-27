import React, {Component} from 'react';
import {StyleSheet, Alert, BackHandler, Linking} from 'react-native';
import {Router, Stack, Scene, Actions} from 'react-native-router-flux';
import {withTheme, DarkTheme, DefaultTheme} from 'react-native-paper';
import {
  Menu,
  Settings,
  About,
  Setup,
  Consumable,
  CommanderSkill,
  BasicDetail,
  Achievement,
  Map as GameMap,
  Collection,
  Warship,
  WarshipDetail,
  WarshipFilter,
  WarshipModule,
  Loading,
  Statistics,
  ClanInfo,
  PlayerAchievement,
  Rating,
  Search,
  Graph,
  SimilarGraph,
  License,
  RS,
  ProVersion,
} from './page';
import {LOCAL, getFirstLaunch, getCurrServer, APP} from './value/data';
import {DataLoader, Downloader} from './core';
import {GREY, BLUE} from 'react-native-material-color';
import {TintColour} from './value/colour';
import {lang} from './value/lang';
import {PlayerShip} from './page/player/PlayerShip';
import {Detailed} from './page/player/Detailed';
import {Rank} from './page/player/Rank';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';
import {NativeManager} from './core/native/NativeManager';
import {SimpleViewHandler} from './core/native/SimpleViewHandler';

setJSExceptionHandler((e, fatal) => {
  if (fatal) {
    showAlert(`${e.name}\n${e.message}`, 'JS');
  } else {
    console.log(`JSException\n${e}`);
  }
}, true);

setNativeExceptionHandler(e => {
  showAlert(e, 'NATIVE');
  console.log(`NativeException\n${e}`);
});

// Ask user to email me the log
function showAlert(msg, mode) {
  Alert.alert(
    `FATAL ${mode} ERROR`,
    `${msg}\n\nPlease contact developer`,
    [
      {
        text: 'OK',
        style: 'cancel',
        onPress: () => null,
      },
      {
        text: 'E-mail',
        onPress: () =>
          SimpleViewHandler.openURL(
            `mailto:development.henryquan@gmail.com?subject=[WoWs Info ${APP.Version}] &body=${msg}`,
          ),
      },
    ],
    {cancelable: false},
  );
}

class App extends Component {
  constructor(props) {
    super(props);

    NativeManager.Instance.setup();

    // const json = {};
    // AsyncStorage.getAllKeys().then(keys => {
    //   AsyncStorage.multiGet(keys).then(value => {
    //     value.map(v => json[v[0]] = JSON.parse(v[1]));
    //     console.log(JSON.stringify(json));
    //   })
    // })

    this.state = {
      loading: true,
      dark: false,
    };

    // Load all data from AsyncStorage
    DataLoader.loadAll().then(data => {
      // console.log(data);

      AppGlobalData.setupWith(data);
      AppGlobalData.shouldSwapButton = AppGlobalData.get(LOCAL.swapButton);
      AppGlobalData.useNoImageMode = AppGlobalData.get(LOCAL.noImageMode);
      AppGlobalData.lastLocation = AppGlobalData.get(LOCAL.lastLocation);
      AppGlobalData.isDarkMode = AppGlobalData.get(LOCAL.darkMode);

      // No more auto dark mode

      let userLang = AppGlobalData.get(LOCAL.userLanguage);
      if (userLang !== '') lang.setLanguage(userLang);

      console.log('state has been set');

      let tint = TintColour();
      if (!tint[50]) tint = BLUE;

      // Setup global dark theme
      AppGlobalData.darkTheme = {
        colors: {
          ...DarkTheme.colors,
          surface: 'black',
          text: GREY[50],
          primary: tint[500],
          accent: tint[300],
        },
      };

      // Setup global light theme
      AppGlobalData.lightTheme = {
        colors: {
          ...DefaultTheme.colors,
          surface: 'white',
          text: GREY[900],
          primary: tint[500],
          accent: tint[300],
        },
      };

      props.theme.roundness = 32;
      props.theme.dark = AppGlobalData.isDarkMode;
      props.theme.colors = AppGlobalData.isDarkMode
        ? AppGlobalData.darkTheme.colors
        : AppGlobalData.lightTheme.colors;
      console.log(props.theme);

      let first = getFirstLaunch();
      if (!first) {
        // Update data here if it is not first launch
        let dn = new Downloader(getCurrServer());
        dn.updateAll(false).then(obj => {
          // Since data are loaded even if user is offline, it should be fine
          this.setState({loading: false, dark: AppGlobalData.isDarkMode});
          // Display message if it is not success
          if (!obj.status) {
            Alert.alert(
              lang.error_title,
              lang.error_download_issue + '\n\n' + obj.log,
            );
          }
        });
      } else {
        this.setState({loading: false, dark: AppGlobalData.isDarkMode});
      }
    });
  }

  render() {
    const {loading, dark} = this.state;
    if (loading) return <Loading />;
    return (
      <Router
        sceneStyle={{flex: 1, backgroundColor: dark ? 'black' : 'white'}}
        backAndroidHandler={this.handleBack}>
        <Stack key="root" hideNavBar>
          <Scene key="Menu" component={Menu} />
          <Scene key="Setup" component={Setup} initial={getFirstLaunch()} />
          <Scene key="Search" component={Search} />
          <Scene key="RS" component={RS} />

          <Scene key="Rating" component={Rating} />
          <Scene key="Statistics" component={Statistics} />
          <Scene key="Graph" component={Graph} />
          <Scene key="PlayerAchievement" component={PlayerAchievement} />
          <Scene key="PlayerShip" component={PlayerShip} />
          <Scene key="PlayerShipDetail" component={Detailed} />
          <Scene key="Rank" component={Rank} />
          <Scene key="ClanInfo" component={ClanInfo} />

          <Scene key="Consumable" component={Consumable} />
          <Scene key="CommanderSkill" component={CommanderSkill} />
          <Scene key="Achievement" component={Achievement} />
          <Scene key="Map" component={GameMap} />
          <Scene key="Collection" component={Collection} />
          <Scene key="Warship" component={Warship} />
          <Scene key="WarshipFilter" component={WarshipFilter} />
          <Scene key="SimilarGraph" component={SimilarGraph} />
          <Scene key="WarshipDetail" component={WarshipDetail} />
          <Scene key="WarshipModule" component={WarshipModule} />
          <Scene key="BasicDetail" component={BasicDetail} />

          <Scene key="Settings" component={Settings} />
          <Scene key="License" component={License} />
          <Scene key="About" component={About} />
          <Scene key="ProVersion" component={ProVersion} />
        </Stack>
      </Router>
    );
  }

  handleBack = () => {
    if (Actions.state.routes.length == 1) {
      BackHandler.exitApp();
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withTheme(App);
