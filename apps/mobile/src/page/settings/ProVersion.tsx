import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert, Linking} from 'react-native';
import {WoWsInfo, LoadingIndicator} from '../../component';
import {Title, List, Button, Text} from 'react-native-paper';
import {
  initConnection,
  getSubscriptions,
  requestSubscription,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
} from 'react-native-iap';
import {setProVersion, validateProVersion} from '../../value/data';
import {Actions} from '../../core/navigation/Actions';
import {lang} from '../../value/lang';

const sku = 'wowsinfo.proversion';

const ProVersion = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');

  useEffect(() => {
    const purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: Record<string, unknown>) => {
        console.log('purchaseUpdatedListener', purchase);
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          await finishTransaction(purchase, false);
          setProVersion(true);
          Actions.pop();
          Alert.alert(lang.pro_title, lang.iap_thx_for_support);
          setTimeout(() => Actions.refresh(), 500);
        }
      },
    );

    const purchaseErrorSubscription = purchaseErrorListener((error: Record<string, unknown>) => {
      console.warn('purchaseErrorListener', error);
    });

    (async () => {
      const allgood = await initConnection();
      console.log(allgood);
      setError(!allgood);

      if (allgood) {
        console.info('This device can make purchases');
        const items = await getSubscriptions([sku]);
        console.log(items);
        if (items.length === 1) {
          const pro: Record<string, unknown> = items[0];
          setPrice(pro.localizedPrice);
          setDiscountPrice(pro.introductoryPrice);
          setLoading(false);
        }
      }
    })();

    return () => {
      purchaseUpdateSubscription?.remove();
      purchaseErrorSubscription?.remove();
    };
  }, []);

  const buy = async () => {
    try {
      await requestSubscription(sku, false);
    } catch (err: unknown) {
      console.warn(err.code, err.message);
    }
  };

  const restore = async () => {
    await validateProVersion(true);
  };

  const renderPurchaseView = () => {
    if (loading) {
      return (
        <View style={styles.loader}>
          <LoadingIndicator />
        </View>
      );
    }
    if (error) return null;

    return (
      <View style={styles.buttonView}>
        <Text style={styles.discount}>{lang.pro_50_off_until_re}</Text>
        <Button
          mode="contained"
          theme={{roundness: 0}}
          onPress={buy}>{`${price} / ${lang.pro_per_year}`}</Button>
        <Button
          mode="outlined"
          style={styles.restoreButton}
          theme={{roundness: 0}}
          onPress={restore}>
          {lang.pro_restore_pro}
        </Button>
      </View>
    );
  };

  return (
    <WoWsInfo hideAds>
      <ScrollView style={styles.viewStyle}>
        <Title style={styles.titleStyle}>{lang.pro_title}</Title>
        <List.Item title={lang.pro_rs} description={lang.pro_rs_subtitle} />
        <List.Item
          title={lang.pro_more_stats}
          description={lang.pro_more_stats_subtitle}
        />
        <List.Item
          title={lang.pro_support_development}
          description={lang.pro_support_development_subtitle}
        />
      </ScrollView>
      {renderPurchaseView()}
      <View style={styles.horizontal}>
        <Button
          onPress={() =>
            Linking.openURL(
              'https://github.com/HenryQuan/WoWs-Info-Future/blob/legacy_version/Privacy%20Policy.md',
            )
          }>
          Privacy policy
        </Button>
        <Button
          onPress={() =>
            Linking.openURL(
              'https://github.com/HenryQuan/WoWs-Info-Future/blob/legacy_version/Term%20of%20Use.md',
            )
          }>
          Term of use
        </Button>
      </View>
    </WoWsInfo>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleStyle: {
    padding: 16,
    paddingTop: 32,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  buttonView: {
    padding: 16,
  },
  restoreButton: {
    marginTop: 8,
  },
  discount: {
    textAlign: 'center',
    marginBottom: 4,
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export {ProVersion};
