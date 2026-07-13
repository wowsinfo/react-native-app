import React from 'react';
import {List} from 'react-native-paper';
import {lang} from '../../value/lang';
import {SafeAction} from '../../core';

const AdmobBanner = () => {
  return (
    <List.Item
      title={lang.extra_support_wowsinfo}
      description={lang.extra_support_wowsinfo_subtitle}
      onPress={() => SafeAction('SupportMe')}
    />
  );
};

export {AdmobBanner};
