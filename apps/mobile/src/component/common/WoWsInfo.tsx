/*
 * WoWsInfo.js
 *
 * This is used as a footer if no name is passed, it is a about button
 */

import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import {Button, Surface} from 'react-native-paper';
import {lang} from '../../value/lang';
import isAndroid from 'react-native-device-detection';
import {FooterButton} from './FooterButton';
import {SafeAction, random} from '../../core';
import {ThemeBackColour, ThemeColour, ViewBackColour} from '../../value/colour';
import {View} from 'react-native-animatable';

export interface WoWsInfoProps {
  children?: React.ReactNode;
  empty?: boolean;
  style?: any;
  title?: string;
  onPress?: () => void;
  about?: boolean;
  upper?: boolean;
  noLeft?: boolean;
  home?: boolean;
  noRight?: boolean;
}

export const WoWsInfo = ({
  children,
  empty,
  style,
  title,
  onPress,
  about,
  upper,
  noLeft,
  noRight,
  home,
}: WoWsInfoProps) => {
  const [lucky, setLucky] = useState('');

  useEffect(() => {
    // 80% of the time, it will be the app name
    let r = random(10);
    if (r < 8) {
      setLucky(lang.app_name);
    } else {
      setLucky(`WoWs Info ${name[random(name.length)]}`);
    }
  }, []);

  const renderLeft = () => {
    return noLeft ? null : (
      <FooterButton
        icon={home ? 'cog' : 'home'}
        left={!AppGlobalData.shouldSwapButton}
      />
    );
  };

  const renderRight = () => {
    return noRight ? null : (
      <FooterButton
        icon={home ? 'search' : 'arrow-left'}
        left={AppGlobalData.shouldSwapButton}
      />
    );
  };

  /// Handle press event, dont always go to about page
  const pressEvent = () => {
    if (onPress) {
      return onPress();
    } else if (about) {
      return navigate();
    }
  };

  const renderFooter = () => {
    const {text, footer} = styles;
    let shouldDisable = !onPress && !about;

    return (
      <View style={[footer, ThemeBackColour()]}>
        {AppGlobalData.shouldSwapButton ? renderRight() : renderLeft()}
        <Button
          disabled={shouldDisable}
          onPress={pressEvent}
          style={text}
          uppercase={upper}>
          {title ? title : lucky}
        </Button>
        {AppGlobalData.shouldSwapButton ? renderLeft() : renderRight()}
      </View>
    );
  };

  /// Navigate to About page
  const navigate = () => {
    SafeAction('About');
  };

  // Add a margin for android devices (full screen so add a margin)
  return (
    <Surface style={[styles.container, style, ThemeBackColour()]}>
      <SafeAreaView style={styles.safeView}>
        <StatusBar
          barStyle={AppGlobalData.isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={ThemeColour()}
        />
        <View style={[styles.child, ViewBackColour()]}>{children}</View>
        {empty ? null : renderFooter()}
      </SafeAreaView>
    </Surface>
  );
};

const name = [
  lang.wowsinfo_black,
  lang.wowsinfo_go,
  lang.wowsinfo_new,
  lang.wowsinfo_ultimate,
  lang.wowsinfo_ultra,
  lang.wowsinfo_white,
  'X',
  'Y',
  'Z',
  '>_<',
  '#',
  '0_0',
  '',
  '^_^',
  '★',
  'α',
  'θ',
  'Ω',
  'Ф',
  '∞',
  '░',
  '( ͡° ͜ʖ ͡°)',
  '¯_(ツ)_/¯',
  '2018',
  '?!',
  '!!',
  '?!',
  '2017',
  '2016',
  '2019',
  '2020',
  '2021',
  '2022',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'DD',
  'BB',
  'CV',
  'CA',
  'SUB',
  // People and clans that really supports me during development (I will add more)
  'Auris2010k',
  'HenryQuan',
  'Zetesian',
  'CJokerLukas',
  'VladimirlS',
  'CICN',
  'ICBC',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 17,
    fontWeight: isAndroid ? 'bold' : '300',
    textAlign: 'center',
    alignSelf: 'center',
    width: '70%',
  },
  child: {
    flex: 1,
  },
  safeView: {
    flex: 1,
  },
  footer: {
    height: 60,
    justifyContent: 'center',
  },
});
