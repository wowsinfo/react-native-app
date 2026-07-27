import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Linking,
  View,
  Share,
} from 'react-native';
import {isAndroid, isIos} from 'react-native-device-detection';
import {List, FAB, Button, useTheme} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import {WoWsInfo, SectionTitle, AppName} from '../../../component';
import {lang} from '../../../value/lang';
import {SafeAction, Downloader, bestWidth} from '../../../core';
import {
  getTintBackgroundColour,
  getTintColour,
} from '../../../value/colour';
import {
  getCurrDomain,
  getCurrServer,
  getCurrPrefix,
  LOCAL,
  getFirstLaunch,
  setFirstLaunch,
  setLastLocation,
  isProVersion,
  onlyProVersion,
  validateProVersion,
  setProVersion,
  differentMonth,
  APP,
} from '../../../value/data';
import {Loading} from '../../common/Loading';
import {Actions} from '../../../core/navigation/Actions';
import {useAppStore} from '../../../store/useAppStore';

const Menu = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [main, setMain] = useState(() =>
    useAppStore.getState().getData(LOCAL.userInfo),
  );
  const [bestItemWidth, setBestItemWidth] = useState(bestWidth(400));
  const first = getFirstLaunch();

  const prefix = useMemo(() => getCurrPrefix(), []);
  const domain = useMemo(() => getCurrDomain(), []);

  const wiki = useMemo(
    () => [
      {
        t: lang.wiki_achievement,
        i: {uri: 'Achievement'},
        p: () => SafeAction('Achievement'),
      },
      {
        t: lang.wiki_warships,
        i: {uri: 'Warship'},
        p: () => SafeAction('Warship'),
      },
      {
        t: lang.wiki_upgrades,
        i: {uri: 'Upgrade'},
        p: () => SafeAction('Consumable', {upgrade: true}),
      },
      {
        t: lang.wiki_flags,
        i: {uri: 'Camouflage'},
        p: () => SafeAction('Consumable'),
      },
      {t: lang.wiki_maps, i: 'map', p: () => SafeAction('Map')},
      {
        t: lang.wiki_collections,
        i: {uri: 'Collection'},
        p: () => SafeAction('Collection'),
      },
    ],
    [],
  );

  const offical_websites = useMemo(
    () => [
      {t: lang.website_official_site, d: `https://worldofwarships.${domain}/`},
      {
        t: lang.website_premium,
        d: `https://${prefix}.wargaming.net/shop/wows/`,
      },
      {
        t: lang.website_global_wiki,
        d: 'http://wiki.wargaming.net/en/World_of_Warships/',
      },
      {t: lang.website_dev_blog, d: 'https://blog.worldofwarships.com/'},
    ],
    [domain, prefix],
  );

  const stats_info_website = useMemo(
    () => [
      {t: lang.website_numbers, d: `https://${prefix}.wows-numbers.com/`},
      {
        t: lang.website_game_models,
        d: 'https://gamemodels3d.com/games/worldofwarships/',
      },
    ],
    [prefix],
  );

  const ultility_websites = useMemo(
    () => [{t: lang.website_wowsft, d: 'https://wowsft.com/'}],
    [],
  );

  const ingame_websites = useMemo(
    () => [
      {
        t: lang.website_wargaming_login,
        d: `https://${prefix}.wargaming.net/id/signin/`,
      },
      {
        t: lang.website_userbonus,
        d: `https://worldofwarships.${domain}/userbonus/`,
      },
      {
        t: lang.website_news_ingame,
        d: `https://worldofwarships.${domain}/news_ingame/`,
      },
      {
        t: lang.website_ingame_armory,
        d: `https://armory.worldofwarships.${domain}/`,
      },
      {
        t: lang.website_ingame_clan,
        d: `https://clans.worldofwarships.${domain}/clans/gateway/wows/profile/`,
      },
      {
        t: lang.website_ingame_warehouse,
        d: `https://warehouse.worldofwarships.${domain}/`,
      },
      {
        t: lang.website_my_logbook,
        d: `https://logbook.worldofwarships.${domain}/`,
      },
    ],
    [domain, prefix],
  );

  const links = useMemo(
    () => [
      {t: lang.content_creator_official, d: lang.content_creator_official_link},
      {t: lang.content_creator_fubuki, d: lang.content_creator_fubuki_link},
    ],
    [],
  );

  const youtubers = useMemo(
    () => [
      {
        t: lang.youtuber_official,
        d: 'https://www.youtube.com/user/worldofwarshipsCOM',
      },
      {t: lang.youtuber_flambass, d: 'https://www.youtube.com/user/Flambass'},
      {t: lang.youtuber_flamu, d: 'https://www.youtube.com/user/cheesec4t'},
      {
        t: lang.youtuber_iChaseGaming,
        d: 'https://www.youtube.com/user/ichasegaming',
      },
      {
        t: lang.youtuber_jingles,
        d: 'https://www.youtube.com/user/BohemianEagle',
      },
      {t: lang.youtuber_notser, d: 'https://www.youtube.com/user/MrNotser'},
      {
        t: lang.youtuber_NoZoupForYou,
        d: 'https://www.youtube.com/user/ZoupGaming',
      },
      {
        t: lang.youtuber_panzerknacker,
        d: 'https://www.youtube.com/user/pzkpasch',
      },
      {
        t: lang.youtuber_Toptier,
        d: 'https://www.youtube.com/channel/UCXOZ2gv_ZGomWNcQU8BBfdQ',
      },
      {t: lang.youtuber_yuro, d: 'https://www.youtube.com/user/spzjess'},
    ],
    [],
  );

  useEffect(() => {
    (async () => {
      if (first) {
        const time = new Promise<false>(r => setTimeout(() => r(false), 20000));
        const dn = new Downloader(getCurrServer());
        const update = dn.updateAll(true);
        try {
          const obj = await Promise.race([time, update]);
          if (!obj) {
            Alert.alert(lang.error_title, lang.error_timeout);
            setLoading(false);
          } else if (obj.status) {
            setLoading(false);
            setFirstLaunch(false);
          } else {
            Alert.alert(
              lang.error_title,
              lang.error_download_issue + '\n\n' + obj.log,
              [
                {
                  text: lang.settings_app_send_feedback_subtitle,
                  onPress: () =>
                    Linking.openURL(APP.Developer + `&body=${obj.log}`),
                  style: 'default',
                },
                {text: 'OK', onPress: () => {}},
              ],
            );
            setLoading(false);
          }
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      } else {
        if (differentMonth()) {
          setLoading(false);
        } else {
          try {
            await validateProVersion();
          } catch {}
          setLoading(false);
        }
      }
    })();
  }, []);

  useEffect(() => {
    setLastLocation('');
    const curr = useAppStore.getState().getData(LOCAL.userInfo);
    if (curr.account_id !== main.account_id) {
      setMain(curr);
    }
  });

  const updateBestWidth = useCallback((event: any) => {
    const goodWidth = event.nativeEvent.layout.width;
    setBestItemWidth(bestWidth(400, goodWidth));
  }, []);

  const shareApp = useCallback((store: string) => {
    if (isIos) Share.share({url: store});
    else Share.share({message: `${lang.app_name}\n${store}`});
  }, []);

  if (loading) return <Loading />;

  let enabled = main.account_id !== '';
  let title = `- ${main.nickname} -`;
  if (title === '-  -') title = '- ??? -';
  const store = isAndroid ? APP.GooglePlay : APP.AppStore;

  return (
    <WoWsInfo
      noRight
      title={title}
      onPress={enabled ? () => SafeAction('Statistics', {info: main}) : null}
      home
      upper={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        onLayout={updateBestWidth}>
        <Animatable.View animation="fadeInDown" easing="ease">
          <AppName />
        </Animatable.View>
        {isProVersion() ? null : (
          <Button
            mode="contained"
            theme={{roundness: 0}}
            style={{marginTop: 8}}
            onPress={() => Actions.ProVersion()}>
            {lang.pro_upgrade_button}
          </Button>
        )}
        <Animatable.View animation="fadeInUp" delay={200} easing="ease">
          <View style={{marginBottom: 80}}>
            <SectionTitle title={lang.wiki_section_title} />
            <View style={styles.wrap}>
              {wiki.map(item => (
                <List.Item
                  key={item.t}
                  title={item.t}
                  style={{paddingLeft: 16, width: bestItemWidth}}
                  onPress={() => item.p()}
                  left={() => (
                    <List.Icon
                      color={getTintColour()[300]}
                      icon={item.i}
                    />
                  )}
                  right={() =>
                    isAndroid ? null : (
                      <List.Icon color={'#9E9E9E'} icon="chevron-right" />
                    )
                  }
                />
              ))}
            </View>
            <SectionTitle title={lang.extra_section_title} />
            <View style={styles.wrap}>
              <List.Item
                key="rs"
                title="RS Beta"
                description={lang.extra_rs_beta}
                style={{width: bestItemWidth}}
                titleStyle={{color: '#FF9800'}}
                onPress={() => (onlyProVersion() ? SafeAction('RS') : null)}
              />
              <List.Item
                key="review"
                title={lang.settings_app_write_review}
                style={{width: bestItemWidth}}
                onPress={() => {
                  Alert.alert(
                    lang.settings_app_write_review_title,
                    lang.settings_app_write_review_message,
                    [
                      {
                        text: lang.settings_app_write_review_yes,
                        onPress: () => Linking.openURL(APP.Developer),
                        style: 'default',
                      },
                      {
                        text: lang.settings_app_write_review_no,
                        onPress: () => Linking.openURL(store),
                      },
                    ],
                    {cancelable: false},
                  );
                }}
                description={store}
              />
              <List.Item
                key="share"
                title={lang.settings_app_share}
                onPress={() => shareApp(store)}
                style={{width: bestItemWidth}}
                description={lang.settings_app_share_subtitle}
              />
            </View>
            <SectionTitle title={lang.website_title} />
            <List.Section titleStyle={{color: theme.colors.onSurface}} title={lang.website_official_title} expanded>
              <View style={styles.wrap}>
                {offical_websites.map(item => (
                  <List.Item
                    key={item.t}
                    title={item.t}
                    description={item.d}
                    style={{width: bestItemWidth}}
                    onPress={() => Linking.openURL(item.d)}
                  />
                ))}
              </View>
            </List.Section>
            <List.Section titleStyle={{color: theme.colors.onSurface}} title={lang.content_creator_title} expanded>
              <View style={styles.wrap}>
                {links.map(item => (
                  <List.Item
                    key={item.t}
                    title={item.t}
                    description={item.d}
                    style={{width: bestItemWidth}}
                    onPress={() => Linking.openURL(item.d)}
                  />
                ))}
              </View>
            </List.Section>
            <List.Section titleStyle={{color: theme.colors.onSurface}} title={lang.website_stats_news_title} expanded>
              <View style={styles.wrap}>
                {stats_info_website.map(item => (
                  <List.Item
                    key={item.t}
                    title={item.t}
                    description={item.d}
                    style={{width: bestItemWidth}}
                    onPress={() => Linking.openURL(item.d)}
                  />
                ))}
              </View>
            </List.Section>
            <List.Section titleStyle={{color: theme.colors.onSurface}} title={lang.website_utility_title} expanded>
              <View style={styles.wrap}>
                {ultility_websites.map(item => (
                  <List.Item
                    key={item.t}
                    title={item.t}
                    description={item.d}
                    style={{width: bestItemWidth}}
                    onPress={() => Linking.openURL(item.d)}
                  />
                ))}
              </View>
            </List.Section>
             <List.Section
              titleStyle={{color: theme.colors.onSurface}}
              title={lang.website_ingame_title}
              description={lang.website_wargaming_login_subtitle}>
              <View style={styles.wrap}>
                {ingame_websites.map(item => (
                  <List.Item
                    key={item.t}
                    title={item.t}
                    description={item.d}
                    style={{width: bestItemWidth}}
                    onPress={() => Linking.openURL(item.d)}
                  />
                ))}
              </View>
            </List.Section>
          </View>
        </Animatable.View>
      </ScrollView>
      <FAB
        icon="magnify"
        color="white"
        style={[styles.fab, {backgroundColor: getTintBackgroundColour()}]}
        onPress={() => SafeAction('Search')}
      />
    </WoWsInfo>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  icon: {borderRadius: 100},
  fab: {position: 'absolute', margin: 16, right: 0, bottom: 0},
  wrap: {flexWrap: 'wrap', flexDirection: 'row'},
});

export default Menu;
