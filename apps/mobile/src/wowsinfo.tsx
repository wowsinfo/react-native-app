import React, {Component, createRef} from 'react';
import {Alert, BackHandler, Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {withTheme, MD3DarkTheme, MD3LightTheme} from 'react-native-paper';
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
import {GREY, RED} from 'react-native-material-color';
import {TintColour} from './value/colour';
import {lang} from './value/lang';
import PlayerShip from './page/player/PlayerShip';
import Detailed from './page/player/Detailed';
import {Rank} from './page/player/Rank';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';

import {navigationRef} from './core/navigation/NavigationService';
import {SafeFetch} from './core';
import {AppKey} from './value/key';
SafeFetch.setAppKey(AppKey);

const Stack = createNativeStackNavigator();

setJSExceptionHandler((e, fatal) => {
  if (fatal) {
    showAlert(`${e.name}\n${e.message}`, 'JS');
  } else {
    console.log(`JSException\n${e}`);
  }
}, false);

setNativeExceptionHandler(e => {
  showAlert(e, 'NATIVE');
  console.log(`NativeException\n${e}`);
});

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
          Linking.openURL(
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


    this.state = {
      loading: true,
      dark: false,
    };

    (async () => {
      const data = await DataLoader.loadAll();
      AppGlobalData.setupWith(data);
      AppGlobalData.shouldSwapButton = AppGlobalData.get(LOCAL.swapButton);
      AppGlobalData.lastLocation = AppGlobalData.get(LOCAL.lastLocation);
      AppGlobalData.isDarkMode = AppGlobalData.get(LOCAL.darkMode);

      const userLang = AppGlobalData.get(LOCAL.userLanguage);
      if (userLang !== '') {
        lang.setLanguage(userLang);
      }

      let tint = TintColour();
      if (!tint?.[50]) {
        tint = RED;
      }

      AppGlobalData.darkTheme = {
        colors: {...MD3DarkTheme.colors, primary: tint[500], surface: 'black', onSurface: GREY[50]},
      };
      AppGlobalData.lightTheme = {
        colors: {...MD3LightTheme.colors, primary: tint[500], surface: 'white', onSurface: GREY[900]},
      };

      props.theme.roundness = 32;
      props.theme.dark = AppGlobalData.isDarkMode;
      props.theme.colors = AppGlobalData.isDarkMode
        ? AppGlobalData.darkTheme.colors
        : AppGlobalData.lightTheme.colors;

      const first = getFirstLaunch();
      if (!first) {
        const obj = await new Downloader(getCurrServer()).updateAll(false);
        this.setState({loading: false, dark: AppGlobalData.isDarkMode});
        if (!obj.status) {
          Alert.alert(lang.error_title, lang.error_download_issue + '\n\n' + obj.log);
        }
      } else {
        this.setState({loading: false, dark: AppGlobalData.isDarkMode});
      }
    })();
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBack,
    );
  }

  componentWillUnmount() {
    this.backHandler?.remove();
  }

  handleBack = () => {
    if (navigationRef.isReady()) {
      const routes = navigationRef.getState()?.routes ?? [];
      if (routes.length <= 1) {
        BackHandler.exitApp();
        return true;
      }
    }
    return false;
  };

  render() {
    const {loading, dark} = this.state;
    if (loading) {
      return <Loading />;
    }
    const navTheme = {
      dark,
      colors: {
        primary: dark ? GREY[50] : GREY[900],
        background: dark ? 'black' : 'white',
        card: dark ? 'black' : 'white',
        text: dark ? GREY[50] : GREY[900],
        border: dark ? '#333' : '#ddd',
        notification: dark ? GREY[50] : GREY[900],
      },
      fonts: {
        regular: {fontFamily: 'System', fontWeight: '400'},
        medium: {fontFamily: 'System', fontWeight: '500'},
        bold: {fontFamily: 'System', fontWeight: '700'},
        heavy: {fontFamily: 'System', fontWeight: '800'},
      },
    };

    return (
      <NavigationContainer ref={navigationRef} theme={navTheme}>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName={getFirstLaunch() ? 'Setup' : 'Menu'}>
          <Stack.Screen name="Menu" component={Menu} />
          <Stack.Screen name="Setup" component={Setup} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="RS" component={RS} />
          <Stack.Screen name="Rating" component={Rating} />
          <Stack.Screen name="Statistics" component={Statistics} />
          <Stack.Screen name="Graph" component={Graph} />
          <Stack.Screen name="PlayerAchievement" component={PlayerAchievement} />
          <Stack.Screen name="PlayerShip" component={PlayerShip} />
          <Stack.Screen name="PlayerShipDetail" component={Detailed} />
          <Stack.Screen name="Rank" component={Rank} />
          <Stack.Screen name="ClanInfo" component={ClanInfo} />
          <Stack.Screen name="Consumable" component={Consumable} />
          <Stack.Screen name="CommanderSkill" component={CommanderSkill} />
          <Stack.Screen name="Achievement" component={Achievement} />
          <Stack.Screen name="Map" component={GameMap} />
          <Stack.Screen name="Collection" component={Collection} />
          <Stack.Screen name="Warship" component={Warship} />
          <Stack.Screen name="WarshipFilter" component={WarshipFilter} />
          <Stack.Screen name="SimilarGraph" component={SimilarGraph} />
          <Stack.Screen name="WarshipDetail" component={WarshipDetail} />
          <Stack.Screen name="WarshipModule" component={WarshipModule} />
          <Stack.Screen name="BasicDetail" component={BasicDetail} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="License" component={License} />
          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="ProVersion" component={ProVersion} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default withTheme(App);
