/**
 * Collection.js
 *
 * This is the wiki collection and it is reused for collection items as well
 */

import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import {FlatGrid} from 'react-native-super-grid';
import {WoWsInfo, WikiIcon} from '../../component';
import {SAVED, setLastLocation} from '../../value/data';
import {SafeAction} from '../../core';
import {Title, Paragraph} from 'react-native-paper';
import {TintTextColour} from '../../value/colour';

interface CollectionItem {
  card_id?: string;
  collection_id: string;
  name: string;
  description: string;
  icon?: string;
  image?: string;
}

interface CollectionProps {
  item?: CollectionItem[];
}

interface CollectionState {
  data: CollectionItem[];
  collection: boolean;
  header: CollectionItem | null;
}

class Collection extends PureComponent<CollectionProps, CollectionState> {
  constructor(props: CollectionProps) {
    super(props);
    setLastLocation('Collection');
    console.log('WIKI - Collection');

    let collection: CollectionItem[] = [];
    let isCollection = false;
    if (props.item) {
      // Inside a single collection
      collection = [...props.item];
      isCollection = true;
    } else {
      // Display all available collections
      let saved = AppGlobalData.get(SAVED.collection).collection;
      Object.keys(saved).forEach(k => {
        collection.push(saved[k]);
      });
    }

    console.log(collection);
    this.state = {
      data: collection,
      collection: isCollection,
      header: isCollection ? collection.shift()! : null,
    };
  }

  render() {
    const {label} = styles;
    const {data, collection, header} = this.state;

    let ID = '';
    // This is to prevent setting ID inside the collection page
    if (data.length > 0 && data[0].card_id) {
      ID = data[0].collection_id;
    }

    return (
      <WoWsInfo title={ID}>
        <FlatGrid
          itemDimension={80}
          data={data}
          renderItem={({item}: {item: CollectionItem}) => {
            return (
              <WikiIcon
                themeIcon={!collection}
                item={item}
                onPress={() => this.itemOrCollection(item)}
              />
            );
          }}
          ListHeaderComponent={() => {
            if (collection) {
              return (
                <View style={{padding: 8}}>
                  <WikiIcon item={header} scale={1.6} />
                  <Title style={[label, TintTextColour()]}>{header.name}</Title>
                  <Paragraph style={label}>{header.description}</Paragraph>
                </View>
              );
            } else {
              return null;
            }
          }}
          showsVerticalScrollIndicator={false}
        />
      </WoWsInfo>
    );
  }

  /**
   * Filter collection items with id
   * @param {*} item
   */
  itemOrCollection(item: CollectionItem) {
    if (item.card_id) {
      // This is an item
      SafeAction('BasicDetail', {item: item});
    } else {
      // This is an collection
      let id = item.collection_id;
      let items = AppGlobalData.get(SAVED.collection).item;

      let collectionItems: CollectionItem[] = [];
      collectionItems.push(AppGlobalData.get(SAVED.collection).collection[id]);
      for (let one in items) {
        let curr = items[one];
        if (curr.collection_id === id) {
          collectionItems.push(curr);
        }
      }
      SafeAction('Collection', {item: collectionItems}, 1);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    alignSelf: 'center',
  },
});

export {Collection};
