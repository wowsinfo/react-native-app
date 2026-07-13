import React from 'react';
import {View} from 'react-native';
import {SafeValue} from '../../core';

const Space = ({height}: {height?: number}) => {
  const h = SafeValue(height, 128);
  return <View style={{height: h}} />;
};

export {Space};
