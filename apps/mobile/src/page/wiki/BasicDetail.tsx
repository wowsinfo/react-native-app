import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import * as Anime from 'react-native-animatable';
import {Title, Paragraph, Caption} from 'react-native-paper';
import {WikiIcon, WoWsInfo, PriceLabel} from '../../component';
import {getTintTextColour} from '../../value/colour';

const renderDetail = (item: Record<string, unknown>) => {
  const {container, label} = styles;
  let title = [label, getTintTextColour()];

  if (item.profile) {
    const {name, description, profile} = item;
    let bonus = Object.entries(profile as Record<string, {description: string}>).reduce((total, curr) => {
      return total + curr[1].description + '\n';
    }, '');

    return (
      <ScrollView contentContainerStyle={container}>
        <Anime.View
          animation="pulse"
          iterationCount="infinite"
          easing="ease"
          useNativeDriver>
          <WikiIcon scale={1.6} item={item} />
        </Anime.View>
        <Title style={title}>{name}</Title>
        <PriceLabel item={item} />
        <Paragraph style={label}>{description}</Paragraph>
        <Caption style={label}>{bonus}</Caption>
      </ScrollView>
    );
  } else if (item.perks) {
    const {name, perks} = item;
    let bonus = Object.entries(perks as Record<string, {description: string}>).reduce((total, curr) => {
      return total + curr[1].description + '\n';
    }, '');

    return (
      <ScrollView contentContainerStyle={container}>
        <Anime.View
          animation="pulse"
          iterationCount="infinite"
          easing="ease"
          useNativeDriver>
          <WikiIcon scale={1.6} item={item} />
        </Anime.View>
        <Title style={title}>{name}</Title>
        <Paragraph style={label}>{bonus}</Paragraph>
      </ScrollView>
    );
  } else if (item.image_inactive || item.card_id) {
    const {description, name} = item;

    return (
      <ScrollView contentContainerStyle={container}>
        <Anime.View
          animation="pulse"
          iterationCount="infinite"
          easing="ease"
          useNativeDriver>
          <WikiIcon scale={1.6} item={item} />
        </Anime.View>
        <Title style={title}>{name}</Title>
        <Paragraph style={label}>{description}</Paragraph>
      </ScrollView>
    );
  }
};

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@wowsinfo/shared';

const BasicDetail = ({route}: NativeStackScreenProps<RootStackParamList, 'BasicDetail'>) => {
  const {item} = route?.params ?? {};
  console.log(item);

  let ID = '';
  if (item?.consumable_id) {
    ID = item.consumable_id;
  } else if (item?.achievement_id) {
    ID = item.achievement_id;
  } else if (item?.collection_id) {
    ID = item.card_id;
  }

  return <WoWsInfo title={ID}>{renderDetail(item)}</WoWsInfo>;
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    margin: 8,
    marginTop: 8,
  },
});

export {BasicDetail};
