/**
 * Loading.js
 *
 * The loading screen with loading animation
 */

import React, {Component} from 'react';
import {StatusBar, Image, StyleSheet, Text} from 'react-native';
import * as Anime from 'react-native-animatable';
import {Surface} from 'react-native-paper';
import {RED} from 'react-native-material-color';
import {getRandomAnimation} from '../../core';
import {lang} from '../../value/lang';

class Loading extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   text: ''
    // };

    // let charArray = lang.setup_loading.split('');
    // setInterval(() => {
    //   const { text } = this.state;
    //   if (text.length === charArray.length) {
    //     this.setState({text: ''});
    //   } else {
    //     this.setState({text: text + charArray[text.length]});
    //   }
    // }, 50);
  }

  // componentWillUnmount() {
  //   clearInterval();
  // }

  render() {
    const {container, logo, label} = styles;

    return (
      <Surface style={container}>
        <StatusBar backgroundColor={RED[700]} />
        <Anime.View
          animation={getRandomAnimation()}
          iterationCount="infinite"
          easing="ease"
          useNativeDriver>
          <Image style={logo} source={{uri: 'Logo'}} />
        </Anime.View>
        <Text style={label}>{lang.setup_loading}</Text>
      </Surface>
    );
  }
}

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
