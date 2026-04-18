/**
 * AppName.js
 *
 * Display app name, app and game version and app logo horizontally
 */

import React from 'react';
import {View, Image, Platform} from 'react-native';
import * as Anime from 'react-native-animatable';
import {Title, Caption, Colors} from 'react-native-paper';
import {lang} from '../../value/lang';
import {LOCAL, APP, isProVersion} from '../../value/data';
import {TintColour} from '../../value/colour';
import {Touchable} from './Touchable';

export const AppName = () => {
  const getVersion = () => {
    let app = APP.Version;
    if (Platform.OS === 'ios') {
      app = APP.IOSVersion;
    }
    return `${app} (${AppGlobalData.get(LOCAL.gameVersion)})`;
  };

  return (
    <Touchable className="mx-2 mb-0 mt-2 flex-row">
      <View className="flex-1 justify-center pl-2">
        <Title
          style={[
            {fontWeight: 'bold'},
            isProVersion() ? {color: Colors.orange500} : {},
          ]}>
          {lang.app_name}
        </Title>
        <Caption style={{marginTop: -8}}>{getVersion()}</Caption>
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
