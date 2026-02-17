import React, {Component} from 'react';
import {Alert, BackHandler} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {withTheme, DarkTheme, DefaultTheme} from 'react-native-paper';
import {navigationRef, Actions} from './core/navigation/NavigationService';
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
import {ReactNativeManager} from './core/native/ReactNativeManager';
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

    ReactNativeManager.Instance.setup();

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
      AppGlobalData.lastLocation = AppGlobalData.get(LOCAL.lastLocation);
      AppGlobalData.isDarkMode = AppGlobalData.get(LOCAL.darkMode);

      // No more auto dark mode

      let userLang = AppGlobalData.get(LOCAL.userLanguage);
      if (userLang !== '') {
        lang.setLanguage(userLang);
      }

      console.log('state has been set');

      let tint = TintColour();
      if (!tint[50]) {
        tint = RED;
      }

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

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBack,
    );
  }

  componentWillUnmount() {
    if (this.backHandler) {
      this.backHandler.remove();
    }
  }

  render() {
    const {loading, dark} = this.state;
    if (loading) {
      return <Loading />;
    }

    const Stack = createStackNavigator();
    const initialRouteName = getFirstLaunch() ? 'Setup' : 'Menu';

    return (
      <NavigationContainer
        ref={navigationRef}
        theme={{
          dark: dark,
          colors: {
            primary: dark ? '#ffffff' : '#000000',
            background: dark ? 'black' : 'white',
            card: dark ? 'black' : 'white',
            text: dark ? '#ffffff' : '#000000',
            border: dark ? '#333333' : '#cccccc',
            notification: dark ? '#ffffff' : '#000000',
          },
        }}>
        <Stack.Navigator
          initialRouteName={initialRouteName}
          screenOptions={{
            headerShown: false,
            cardStyle: {
              flex: 1,
              backgroundColor: dark ? 'black' : 'white',
            },
          }}>
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

  handleBack = () => {
    if (Actions.state.routes.length === 1) {
      return false; // Allow app to exit
    }
    Actions.pop();
    return true; // Event handled
  };
}

export default withTheme(App);
