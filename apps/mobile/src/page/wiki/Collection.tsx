import React, {useEffect, useMemo, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {FlatGrid} from 'react-native-super-grid';
import {WoWsInfo, WikiIcon} from '../../component';
import {SAVED, setLastLocation} from '../../value/data';
import {SafeAction} from '../../core';
import {Title, Paragraph} from 'react-native-paper';
import {getTintTextColour} from '../../value/colour';
import {useAppStore} from '../../store/useAppStore';

const Collection = ({route}: any) => {
  useEffect(() => {
    setLastLocation('Collection');
    console.log('WIKI - Collection');
  }, []);

  const {data, isCollection, header} = useMemo(() => {
    let collection: any[] = [];
    let coll = false;
    if (route?.params?.item) {
      collection = route?.params?.item;
      coll = true;
    } else {
      let saved = useAppStore.getState().getData(SAVED.collection).collection;
      Object.keys(saved).forEach(k => collection.push(saved[k]));
    }
    const h = coll ? collection.shift() : null;
    return {data: collection, isCollection: coll, header: h};
  }, [route?.params?.item]);

  const itemOrCollection = useCallback((item: any) => {
    if (item.card_id) {
      SafeAction('BasicDetail', {item: item});
    } else {
      let id = item.collection_id;
      let saved = useAppStore.getState().getData(SAVED.collection);
      let collectionItems: any[] = [];
      collectionItems.push(saved.collection[id]);
      for (let one in saved.item) {
        let curr = saved.item[one];
        if (curr.collection_id === id) {
          collectionItems.push(curr);
        }
      }
      SafeAction('Collection', {item: collectionItems}, 1);
    }
  }, []);

  let ID = '';
  if (data.length > 0 && data[0].card_id) {
    ID = data[0].collection_id;
  }

  return (
    <WoWsInfo title={ID}>
      <FlatGrid
        itemDimension={80}
        data={data}
        renderItem={({item}) => (
          <WikiIcon item={item} onPress={() => itemOrCollection(item)} />
        )}
        ListHeaderComponent={() => {
          if (isCollection) {
            return (
              <View style={{padding: 8}}>
                <WikiIcon item={header} scale={1.6} />
                <Title style={[styles.label, getTintTextColour()]}>
                  {header.name}
                </Title>
                <Paragraph style={styles.label}>{header.description}</Paragraph>
              </View>
            );
          }
          return null;
        }}
        showsVerticalScrollIndicator={false}
      />
    </WoWsInfo>
  );
};

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
