/**
 * PriceLabel.js
 *
 * Display consumable and warship price (silver for credit and gold for doubloon)
 */

import React from 'react';
import {Text} from 'react-native-paper';

export interface PriceLabelProps {
  item: any;
}

export const PriceLabel = ({item}: PriceLabelProps) => {
  const {price_credit, price_gold} = item;

  let price = price_gold;
  let colour = 'orange';
  if (!price_gold || price_gold === 0) {
    price = price_credit;
    colour = 'grey';
  }

  return <Text style={{color: colour, textAlign: 'center'}}>{price}</Text>;
};
