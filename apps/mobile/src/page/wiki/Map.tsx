import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Dimensions} from 'react-native';
import {WoWsInfo, LoadingIndicator} from '../../component';
import {SAVED, setLastLocation} from '../../value/data';
import {List, Portal, Dialog} from 'react-native-paper';
import {FlatGrid} from 'react-native-super-grid';
import {useAppStore} from '../../store/useAppStore';

const GameMap = () => {
  useEffect(() => {
    setLastLocation('Map');
    console.log('WIKI - Map');
  }, []);

  const [data] = useState(() => useAppStore.getState().getData(SAVED.map));
  const [shown, setShown] = useState(false);
  const [map, setMap] = useState('');
  const [loading, setLoading] = useState(true);

  const {width = 390, height = 844} = Dimensions.get('window') || {};
  let imageWidth = width > height ? height : width;
  imageWidth -= 20;

  return (
    <WoWsInfo>
      <FlatGrid
        data={data}
        itemDimension={300}
        spacing={0}
        renderItem={({item}) => (
          <List.Item
            title={item.name}
            description={item.description}
            key={item.name}
            onPress={() => {
              setShown(true);
              setMap(item.icon);
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      <Portal>
        <Dialog
          visible={shown}
          onDismiss={() => {
            setShown(false);
            setLoading(true);
          }}
          dismissable
          theme={{roundness: 16}}
          style={{
            height: imageWidth,
            width: imageWidth,
            alignSelf: 'center',
            backgroundColor: 'transparent',
            overflow: 'hidden',
          }}>
          <Image
            source={{uri: map}}
            onLoadEnd={() => setLoading(false)}
            style={{flex: 1, height: null, width: null, borderRadius: 16}}
          />
          {loading ? <LoadingIndicator style={styles.indicator} /> : null}
        </Dialog>
      </Portal>
    </WoWsInfo>
  );
};

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export {GameMap as Map};
