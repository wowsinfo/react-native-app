/**
 * AppName.js
 *
 * Display app name, app and game version and app logo horizontally
 */

import React from 'react';
import {View, Image, Platform, StyleSheet} from 'react-native';
import * as Anime from 'react-native-animatable';
import {Title, Caption, Colors} from 'react-native-paper';
import {lang} from '../../value/lang';
import {LOCAL, APP, isProVersion} from '../../value/data';
import {TintColour} from '../../value/colour';
import {Touchable} from './Touchable';

export const AppName = () => {
  const {container, game, appName, horizontal} = styles;

  const getVersion = () => {
    let app = APP.Version;
    if (Platform.OS === 'ios') {
      app = APP.IOSVersion;
    }
    return `${app} (${AppGlobalData.get(LOCAL.gameVersion)})`;
  };

  return (
    <Touchable style={horizontal}>
      <View style={container}>
        <Title
          style={[appName, isProVersion() ? {color: Colors.orange500} : {}]}>
          {lang.app_name}
        </Title>
        <Caption style={game}>{getVersion()}</Caption>
      </View>
      <Anime.View
        animation="pulse"
        iterationCount="infinite"
        easing="ease"
        useNativeDriver>
        <Image
          source={{uri: 'Logo'}}
          style={{height: 64, width: 64, tintColor: TintColour()[500]}}
        />
      </Anime.View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 8,
    justifyContent: 'center',
  },
  game: {
    marginTop: -8,
  },
  appName: {
    fontWeight: 'bold',
  },
  horizontal: {
    flexDirection: 'row',
    margin: 8,
    marginLeft: 8,
    marginBottom: 0,
  },
});
