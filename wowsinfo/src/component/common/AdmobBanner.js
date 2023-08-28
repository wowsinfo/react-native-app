import React, {Component} from 'react';
import {List} from 'react-native-paper';
import {lang} from '../../value/lang';
import {SafeAction} from '../../core';

// mark as deprecated
class AdmobBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: true,
    };
  }

  render() {
    // Ask users to support me (especially IOS users)
    return (
      <List.Item
        title={lang.extra_support_wowsinfo}
        description={lang.extra_support_wowsinfo_subtitle}
        onPress={() => SafeAction('SupportMe')}
      />
    );
  }

  hideAds = () => this.setState({success: false});
  logError = err => {
    console.log('err', err);
    this.setState({success: false});
  };
}

export {AdmobBanner};
