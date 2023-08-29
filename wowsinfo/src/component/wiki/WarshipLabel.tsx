/**
 * WarshipLabel.js
 *
 * It is a label with ship name, tier and it will be orange if it is a special ship
 */

import React from 'react';
import {StyleSheet} from 'react-native';
import {Caption, Paragraph, Subheading} from 'react-native-paper';
import {getTierLabel} from '../../core';
import {lang} from '../../value/lang';

export interface WarshipLabelProps {
  style?: any;
  item?: any;
};

export const WarshipLabel = ({style, item}: WarshipLabelProps) => {
  const {label} = styles;
  if (item) {
    const {tier, name, premium} = item;
    return (
      <Paragraph
        numberOfLines={1}
        style={[style, label, premium ? {color: '#FF9800'} : {}]}>
        {`${getTierLabel(tier)} ${name}`}
      </Paragraph>
    );
  } else {
    return (
      <Paragraph numberOfLines={1} style={[style, label]}>
        {lang.warship_unknown}
      </Paragraph>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
  },
});
