import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {WoWsInfo} from '../../component';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@wowsinfo/shared';

const SimilarGraph = ({route}: NativeStackScreenProps<RootStackParamList, 'SimilarGraph'>) => (
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
