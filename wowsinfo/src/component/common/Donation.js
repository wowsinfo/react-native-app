import React, {Component} from 'react';
import * as RNIap from 'react-native-iap';
import {View} from 'react-native';
import {List} from 'react-native-paper';
import {lang} from '../../value/lang';
import {APP} from '../../value/data';
import {SimpleViewHandler} from '../../core/native/SimpleViewHandler';

// Now, we have 4 tiers ($1, $3, $5 and $10) for donations
const itemSkus = [
  'com.yihengquan.wowsinfo.support1',
  'com.yihengquan.wowsinfo.support3',
  'com.yihengquan.wowsinfo.support5',
  'com.yihengquan.wowsinfo.support10',
];

class Donation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
    };
  }

  async componentDidMount() {
    if (!AppGlobalData.githubVersion) {
      try {
        const products = await RNIap.getProducts(itemSkus);
        await RNIap.consumeAllItems();
        products.sort((a, b) => a.price.localeCompare(b.price));
        this.setState({products});
      } catch (err) {
        console.warn(err);
      }
    }
  }

  render() {
    const {products} = this.state;
    console.log(this.state);

    this.support = [
      {t: lang.support_patreon, d: APP.Patreon, c: 'orange'},
      {t: lang.support_paypal, d: APP.PayPal, c: 'blue'},
      {t: lang.support_wechat, d: APP.WeChat, c: 'green'},
    ];

    if (!AppGlobalData.githubVersion) {
      this.support = [
        {
          t: 'GitHub',
          d: 'https://github.com/HenryQuan/WoWs-Info-Origin',
          c: 'black',
        },
      ];
    }

    return (
      <View>
        {this.support.map(item => {
          return (
            <List.Item
              title={item.t}
              key={item.t}
              description={item.d}
              onPress={() => SimpleViewHandler.openURL(item.d)}
            />
          );
        })}
      </View>
    );
  }

  async supportWoWsInfo(item) {
    try {
      const purchase = await RNIap.buyProduct(item.productId);
      await RNIap.consumePurchase(purchase.purchaseToken);
      this.setState({
        receipt: purchase.transactionReceipt,
      });
    } catch (err) {
      console.error(err.code, err.message);
      const subscription = RNIap.addAdditionalSuccessPurchaseListenerIOS(
        async purchase => {
          this.setState({receipt: purchase.transactionReceipt}, () =>
            this.goToNext(),
          );
          subscription.remove();
        },
      );
    }
  }
}

export {Donation};
