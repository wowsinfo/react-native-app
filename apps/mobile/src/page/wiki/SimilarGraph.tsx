import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {WoWsInfo} from '../../component';

const SimilarGraph = ({route}: any) => (
  <WoWsInfo>
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}>
      {route?.params?.info}
    </ScrollView>
  </WoWsInfo>
);

const styles = StyleSheet.create({
  scroll: {
    padding: 8,
  },
});

export {SimilarGraph};
