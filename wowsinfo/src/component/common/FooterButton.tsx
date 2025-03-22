import React  from 'react';
import {SafeAreaView} from 'react-native';
import {IconButton, MD2Colors as Colors} from 'react-native-paper';
import {SafeAction} from '../../core';
import {lang} from '../../value/lang';
import {setLastLocation} from '../../value/data';
import { useGlobalNavigator } from '../../core/util/Navigation';

export interface FooterButtonProps {
  icon: string;
  left: boolean;
}

export const FooterButton = ({icon, left}: FooterButtonProps) => {
  /// 'cog' is the name for new settings

  let al = '';
  if (icon === 'cog') {
    al = lang.button_settings_label;
  } else if (icon === 'arrow-left') {
    al = lang.button_back_label;
  } else if (icon === 'home') {
    al = lang.button_home_label;
  } else {
    al = lang.button_menu_label;
  }

  const pressEvent = () => {
    const navigator = useGlobalNavigator();
    if (icon === 'cog') {
      SafeAction('Settings');
    } else if (icon === 'arrow-left') {
      navigator.pop();
      // @ts-ignore
      // if (Actions.state.routes.length === 2) {
      //   setTimeout(() => navigator.refresh(), 1000);
      // }
    } else if (icon === 'home') {
      navigator.popToTop();
      // Clear last location
      setLastLocation('');
      // setTimeout(() => navigator.refresh(), 1000);
    } else {
      SafeAction('Search');
    }
  };

  return (
    <SafeAreaView
      style={{
        position: 'absolute',
        left: left ? 8 : null,
        right: left ? null : 8,
      }}>
      <IconButton
        color={Colors.grey500}
        icon={icon}
        accessibilityLabel={al}
        style={{height: 48, width: 48, borderRadius: 24}}
        onPress={() => pressEvent()}
      />
    </SafeAreaView>
  );
};
