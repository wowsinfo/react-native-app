import {Blue, Grey} from 'react-native-material-color';
import isIos from 'react-native-device-detection';
import {LoadingIndicator as SharedLoadingIndicator} from '@repo/ui';
import {TintColour} from '../../value/colour';
import type {LoadingIndicatorProps} from '@repo/ui';

export function LoadingIndicator(props: LoadingIndicatorProps) {
  let appTheme = TintColour();
  if (!appTheme) {
    appTheme = Blue;
  }

  return (
    <SharedLoadingIndicator
      {...props}
      color={!isIos ? appTheme[500] : Grey}
    />
  );
}
