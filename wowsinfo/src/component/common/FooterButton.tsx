import React  from 'react';
import {SafeAreaView} from 'react-native';
import {IconButton, Colors} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
import {SafeAction} from '../../core';
import {lang} from '../../value/lang';
import {setLastLocation} from '../../value/data';

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
    if (icon === 'cog') {
      SafeAction('Settings');
    } else if (icon === 'arrow-left') {
      Actions.pop();
      // @ts-ignore
      if (Actions.state.routes.length === 2) {
        setTimeout(() => Actions.refresh(), 1000);
      }
    } else if (icon === 'home') {
      Actions.popTo('Menu');
      // Clear last location
      setLastLocation('');
      setTimeout(() => Actions.refresh(), 1000);
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
