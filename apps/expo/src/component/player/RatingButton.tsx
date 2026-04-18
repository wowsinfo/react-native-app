/**
 * RatingButton.js
 *
 * A button displaying rating
 */

import React from 'react';
import {Button} from 'react-native-paper';
import {getColour, getComment, SafeAction} from '../../core';

export interface RatingButtonProps {
  rating?: number;
  number?: boolean;
}

export const RatingButton = ({rating, number}: RatingButtonProps) => {
  if (number) {
    return (
      <Button mode="contained" color={getColour(rating)}>
        {rating}
      </Button>
    );
  } else {
    if (rating == null || rating === 0) {
      // return a place holder button
      return (
        <Button mode="contained" color="transparent" theme={{roundness: 0}} />
      );
    }

    return (
      <Button
        mode="contained"
        color={getColour(rating)}
        onPress={() => SafeAction('Rating')}
        theme={{roundness: 0}}>
        {getComment(rating)}
      </Button>
    );
  }
};
