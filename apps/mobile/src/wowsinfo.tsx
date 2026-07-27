import React, {useState, useEffect} from 'react';
import {Alert, BackHandler, Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTheme, MD3DarkTheme, MD3LightTheme} from 'react-native-paper';
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
import {getTintColour, buildElevationColors} from './value/colour';
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
import {useAppStore} from './store/useAppStore';
SafeFetch.setAppKey(AppKey);

const Stack = createNativeStackNavigator();

setJSExceptionHandler((e, fatal) => {
  const msg = `JSException [fatal=${fatal}]\n${e.name}\n${e.message}\n${e.stack}`;
  console.log(msg);
  try { (global as any).__errorLog(msg); } catch (_) {}
  if (fatal) {
    showAlert(`${e.name}\n${e.message}`, 'JS');
  }
}, false);

setNativeExceptionHandler(e => {
  showAlert(e, 'NATIVE');
  console.log(`NativeException\n${e}`);
  try { (global as any).__errorLog(`NativeException\n${e}`); } catch (_) {}
});

function showAlert(msg: any, mode: any) {
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

const App = () => {
  const store = useAppStore;
  const gs = () => store.getState();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (navigationRef.isReady()) {
          const routes = navigationRef.getState()?.routes ?? [];
          if (routes.length <= 1) {
            BackHandler.exitApp();
            return true;
          }
        }
        return false;
      },
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    (async () => {
      const data = await DataLoader.loadAll();
      AppGlobalData.setupWith(data);
      gs().hydrate(data);
      gs().setSwapButton(gs().getData(LOCAL.swapButton) ?? false);
      gs().setLastLocation(gs().getData(LOCAL.lastLocation) ?? '');
      gs().setDarkMode(gs().getData(LOCAL.darkMode) ?? false);

      const userLang = gs().getData(LOCAL.userLanguage) ?? '';
      if (userLang !== '') {
        lang.setLanguage(userLang);
      }

      let tint = getTintColour();
      if (!tint?.[50]) {
        tint = RED;
      }

      const darkTheme = {
        colors: {
          ...MD3DarkTheme.colors,
          primary: tint[500],
          surface: 'black',
          onSurface: GREY[50],
          onSurfaceVariant: GREY[200],
          elevation: buildElevationColors(tint[500]),
        },
      };
      const lightTheme = {
        colors: {
          ...MD3LightTheme.colors,
          primary: tint[500],
          surface: 'white',
          onSurface: GREY[900],
          onSurfaceVariant: GREY[700],
          elevation: buildElevationColors(tint[500]),
        },
      };

      gs().setTheme(lightTheme, darkTheme);
      theme.dark = gs().isDarkMode;
      theme.colors = gs().isDarkMode ? darkTheme.colors : lightTheme.colors;

      const isDark = gs().isDarkMode;
      const first = getFirstLaunch();
      if (!first) {
        const obj = await new Downloader(getCurrServer()).updateAll(false);
        setLoading(false);
        setDark(isDark);
        if (!obj.status) {
          Alert.alert(
            lang.error_title,
            lang.error_download_issue + '\n\n' + obj.log,
          );
        }
      } else {
        setLoading(false);
        setDark(isDark);
      }
    })();
  }, []);

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
};

export default App;
