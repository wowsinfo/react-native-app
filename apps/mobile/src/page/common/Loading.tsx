import React from 'react';
import {StatusBar, Image, StyleSheet, Text} from 'react-native';
import * as Anime from 'react-native-animatable';
import {Surface} from 'react-native-paper';
import {RED} from 'react-native-material-color';
import {getRandomAnimation} from '../../core';
import {lang} from '../../value/lang';

const Loading = () => {
  return (
    <Surface style={styles.container}>
      <StatusBar backgroundColor={RED[700]} />
      <Anime.View
        animation={getRandomAnimation()}
        iterationCount="infinite"
        easing="ease"
        useNativeDriver>
        <Image style={styles.logo} source={{uri: 'Logo'}} />
      </Anime.View>
      <Text style={styles.label}>{lang.setup_loading}</Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RED[500],
  },
  logo: {
    tintColor: 'white',
    width: 128,
    height: 128,
  },
  label: {
    color: 'white',
  },
});

export {Loading};
