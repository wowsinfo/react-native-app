/**
 * Space.tsx
 *
 * Add space to component
 */

import React, {Component} from 'react';
import {View} from 'react-native';
import {SafeValue} from '../../core';

interface SpaceProps {
  height?: number;
}

class Space extends Component<SpaceProps> {
  render() {
    const {height} = this.props;

    // Default value is 128
    const h = SafeValue(height, 128);

    return <View style={{height: h}} />;
  }
}

export {Space};
