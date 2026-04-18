import React, {useEffect, useState} from 'react';
import {Image, Dimensions} from 'react-native';
import * as Anime from 'react-native-animatable';
import {WoWsInfo, Touchable} from '../../component';
import {TintColour} from '../../value/colour';
import {lang} from '../../value/lang';
import {getRandomAnimation} from '../../core';
import {SimpleViewHandler} from '../../core/native/SimpleViewHandler';

export const About = () => {
  const [animation, setAnimation] = useState('pulse');
  const {width, height} = Dimensions.get('window');
  let imageWidth = width > height ? height * 0.5 : width * 0.5;

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimation(getRandomAnimation());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <WoWsInfo>
      <Touchable className="h-full items-center justify-center" onPress={() => SimpleViewHandler.openURL(lang.about_github_link)}>
        <Anime.View
          animation={animation}
          iterationCount="infinite"
          easing="ease"
          useNativeDriver>
          <Image
            style={{
              tintColor: TintColour()[500],
              height: imageWidth,
              width: imageWidth,
            }}
            source={{uri: 'Logo'}}
          />
        </Anime.View>
      </Touchable>
    </WoWsInfo>
  );
};
