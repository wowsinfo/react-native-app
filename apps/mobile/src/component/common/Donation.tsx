import React, {useState, useEffect, useMemo} from 'react';
import * as RNIap from 'react-native-iap';
import {View, Linking} from 'react-native';
import {List} from 'react-native-paper';
import {lang} from '../../value/lang';
import {APP} from '../../value/data';
import {useAppStore} from '../../store/useAppStore';

const itemSkus = [
  'com.yihengquan.wowsinfo.support1',
  'com.yihengquan.wowsinfo.support3',
  'com.yihengquan.wowsinfo.support5',
  'com.yihengquan.wowsinfo.support10',
];

const Donation = () => {
  const [products, setProducts] = useState<RNIap.Product[] | null>(null);
  const githubVersion = useAppStore.getState().githubVersion;

  useEffect(() => {
    if (!githubVersion) {
      (async () => {
        try {
          const items = await RNIap.getProducts(itemSkus);
          items.sort((a: any, b: any) => a.price.localeCompare(b.price));
          setProducts(items);
        } catch (err) {
          console.warn(err);
        }
      })();
    }
  }, [githubVersion]);

  let support = useMemo(() => {
    if (!githubVersion) {
      return [
        {t: lang.support_patreon, d: APP.Patreon, c: 'orange'},
        {t: lang.support_paypal, d: APP.PayPal, c: 'blue'},
        {t: lang.support_wechat, d: APP.WeChat, c: 'green'},
      ];
    }
    return [
      {
        t: 'GitHub',
        d: 'https://github.com/HenryQuan/WoWs-Info-Origin',
        c: 'black',
      },
    ];
  }, [githubVersion]);

  return (
    <View>
      {support.map(item => (
        <List.Item
          title={item.t}
          key={item.t}
          description={item.d}
          onPress={() => Linking.openURL(item.d)}
        />
      ))}
    </View>
  );
};

export {Donation};
