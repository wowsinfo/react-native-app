/**
 * SimilarGraph.js
 *
 * Displaying all similar ships' average stats
 */

import React, {PureComponent} from 'react';
import {ScrollView} from 'react-native';
import {WoWsInfo} from '../../component';

class SimilarGraph extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <WoWsInfo>
        <ScrollView
          contentContainerStyle={{padding: 8}}
          showsVerticalScrollIndicator={false}>
          {this.props.info}
        </ScrollView>
      </WoWsInfo>
    );
  }
}

export {SimilarGraph};
