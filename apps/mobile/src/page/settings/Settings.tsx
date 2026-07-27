import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import {isAndroid} from 'react-native-device-detection';
import {
  List,
  Button,
  Checkbox,
  Portal,
  Dialog,
  MD3DarkTheme,
  MD3LightTheme,
  useTheme,
} from 'react-native-paper';
import {Actions} from '../../core/navigation/Actions';
import {WoWsInfo, Touchable, SectionTitle} from '../../component';
import {
  APP,
  getCurrServer,
  getAPILanguage,
  SERVER,
  getAPIList,
  setCurrServer,
  setAPILanguage,
  setSwapButton,
  getSwapButton,
  getUserLang,
  setUserLang,
  setFirstLaunch,
} from '../../value/data';
import {
  getTintColour,
  setTintColour,
  toggleDarkMode,
  buildElevationColors,
} from '../../value/colour';
import {SafeAction, SafeFetch, Guard} from '../../core';
import {
  BLUE,
  RED,
  GREEN,
  PINK,
  PURPLE,
  DEEPPRUPLE,
  INDIGO,
  LIGHTBLUE,
  CYAN,
  TEAL,
  LIGHTGREEN,
  LIME,
  YELLOW,
  AMBER,
  DEEPORANGE,
  BROWN,
  GREY,
  BLUEGREY,
} from 'react-native-material-color';
import {lang} from '../../value/lang';
import {WikiAPI} from '../../value/api';
import {useAppStore} from '../../store/useAppStore';

const colourList = [
  RED,
  PINK,
  PURPLE,
  DEEPPRUPLE,
  INDIGO,
  BLUE,
  LIGHTBLUE,
  CYAN,
  TEAL,
  GREEN,
  LIGHTGREEN,
  LIME,
  YELLOW,
  AMBER,
  DEEPORANGE,
  BROWN,
  GREY,
  BLUEGREY,
];

const Settings = () => {
  const store = useAppStore;
  const gs = () => store.getState();
  const theme = useTheme();

  const [darkMode, setDarkMode] = useState(gs().isDarkMode);
  const [tintColour, setLocalTint] = useState(getTintColour());
  const [showColour, setShowColour] = useState(false);
  const [server, setServer] = useState(getCurrServer());
  const [APILanguage, setApiLang] = useState(getAPILanguage());
  const [userLanguage, setUserLangState] = useState(getUserLang());
  const [swapButton, setSwapBtn] = useState(getSwapButton());

  useEffect(() => {
    return () => {
      setTimeout(() => Actions.refresh(), 300);
    };
  }, []);

  const updateTheme = useCallback(() => {
    toggleDarkMode();
    const nextDark = gs().isDarkMode;
    setDarkMode(nextDark);
    theme.dark = nextDark;

    const tint = tintColour?.[500];
    if (nextDark) {
      const dark = {
        colors: {
          ...MD3DarkTheme.colors,
          primary: tint,
          secondary: tintColour?.[300],
          secondaryContainer: tintColour?.[100],
          surface: 'black',
          onSurface: GREY[50],
          elevation: buildElevationColors(tint),
        },
      };
      store.getState().setTheme({}, dark);
      theme.colors = dark.colors;
    } else {
      const light = {
        colors: {
          ...MD3LightTheme.colors,
          primary: tint,
          secondary: tintColour?.[300],
          secondaryContainer: tintColour?.[100],
          surface: 'white',
          onSurface: GREY[900],
          elevation: buildElevationColors(tint),
        },
      };
      store.getState().setTheme(light, {});
      theme.colors = light.colors;
    }
  }, [tintColour, theme, store]);

  const updateTint = useCallback(
    (tint: Record<string, unknown>) => {
      setTintColour(tint);
      theme.colors.primary = tint[500];
      theme.colors.secondary = tint[300];
      setShowColour(false);
      setLocalTint(tint);
    },
    [theme],
  );

  const updateServer = useCallback((index: number) => {
    setCurrServer(index);
    setServer(index);
  }, []);

  const updateApiLanguage = useCallback(
    (language: string, force?: boolean) => {
      if (!force && language === APILanguage) return;
      setAPILanguage(language);
      setApiLang(language);
      setFirstLaunch(true);
      store.getState().setShouldUpdateAPI(false);
      Actions.reset('Menu');
    },
    [APILanguage, store],
  );

  const updateUserLang = useCallback((code: string) => {
    setUserLang(code);
    lang.setLanguage(code);
    setUserLangState(code);
  }, []);

  const swapBtnHandler = useCallback((curr: boolean) => {
    setSwapButton(curr);
    setSwapBtn(getSwapButton());
  }, []);

  const checkAppUpdate = useCallback(async () => {
    if (gs().canCheckForUpdate) {
      store.getState().setCanCheckForUpdate(false);
      const v = await SafeFetch.normal(WikiAPI.Github_AppVersion);
      const version = Guard(v, 'version', '') as string;
      if (version) {
        if (version > APP.Version) {
          displayUpdate(true, version);
        } else {
          displayUpdate(false);
        }
      }
    } else {
      displayUpdate(false);
    }
  }, [store]);

  const displayUpdate = (result: boolean, version?: string) => {
    if (result) {
      const format = require('string-format');
      Alert.alert(
        lang.app_name,
        format(lang.settings_app_has_update, version),
        [
          {text: 'Google Play', onPress: () => Linking.openURL(APP.GooglePlay)},
          {text: 'Github', onPress: () => Linking.openURL(APP.LatestRelease)},
        ],
      );
    } else {
      Alert.alert(lang.app_name, lang.settings_app_no_update);
    }
  };

  const renderAPILanguage = (langList: Record<string, unknown>) => {
    const langData = Object.keys(langList).sort();
    return (
      <View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {langData.map(item => (
            <Button key={item} onPress={() => updateApiLanguage(item)}>
              {langList[item]}
            </Button>
          ))}
        </View>
        <Button
          mode="contained"
          theme={{roundness: 0}}
          onPress={() => {
            Alert.alert(lang.app_name, lang.setting_api_update_data_title, [
              {
                text: lang.setting_api_update_data_update,
                onPress: () => updateApiLanguage(APILanguage, true),
                style: 'destructive',
              },
              {text: lang.setting_api_update_data_cancel, onPress: () => null},
            ]);
          }}>
          {lang.setting_api_update_data}
        </Button>
      </View>
    );
  };

  const langList = getAPIList();
  const appLang: Record<string, string> = {
    en: 'English',
    ja: '日本語',
    zh: '简体中文',
    'zh-hant': '繁体中文',
  };
  const appLangList = Object.entries(appLang).map(([code, l]) => ({
    code,
    lang: l,
  }));
  const display = appLang[userLanguage] ?? '???';

  return (
    <WoWsInfo about>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SectionTitle title={lang.settings_api_settings} />
        <List.Section
          title={`${lang.setting_game_server} - ${lang.server_name[server]}`}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {SERVER.slice(1).map((key, index) => (
              <Button
                key={key + '_server'}
                onPress={() => updateServer(index + 1)}>
                {lang.server_name[index + 1]}
              </Button>
            ))}
          </View>
        </List.Section>
        <List.Section
          title={`${lang.setting_api_language} - ${langList[APILanguage]}`}>
          {gs().shouldUpdateAPI ? renderAPILanguage(langList) : null}
        </List.Section>
        <List.Section title={`${lang.setting_app_language} - ${display}`}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {appLangList.map(item => (
              <Button key={item.code} onPress={() => updateUserLang(item.code)}>
                {item.lang}
              </Button>
            ))}
          </View>
        </List.Section>

        <SectionTitle title={lang.settings_app_settings} />
        <List.Item
          key="dark_mode"
          title={lang.settings_app_dark_mode}
          onPress={updateTheme}
          right={() => (
            <Checkbox
              status={darkMode ? 'checked' : 'unchecked'}
              color={tintColour?.[500]}
            />
          )}
        />
        <List.Item
          key="theme_colour"
          title={lang.settings_app_theme_colour}
          onPress={() => setShowColour(true)}
          right={() => (
            <View style={[styles.tint, {backgroundColor: tintColour[500]}]} />
          )}
        />
        <List.Item
          key="swap_button"
          title={lang.settings_app_swap_buttons}
          onPress={() => swapBtnHandler(!swapButton)}
          right={() => (
            <Checkbox
              status={swapButton ? 'checked' : 'unchecked'}
              color={tintColour?.[500]}
            />
          )}
        />

        <SectionTitle title={lang.app_name} />
        <List.Item
          key="feedback"
          title={lang.settings_app_send_feedback}
          description={lang.settings_app_send_feedback_subtitle}
          onPress={() => Linking.openURL(APP.Developer)}
        />
        <List.Item
          key="report_issue"
          title={lang.settings_app_report_issues}
          description={`${APP.Github}/issues/new`}
          onPress={() => Linking.openURL(`${APP.Github}/issues/new`)}
        />
        {isAndroid ? (
          <List.Item
            key="check_update"
            title={lang.settings_app_check_for_update}
            onPress={checkAppUpdate}
            description={`v${APP.Version}`}
          />
        ) : null}

        <SectionTitle title={lang.settings_open_source} />
        <List.Item
          title={lang.settings_open_source_github}
          description={APP.Github}
          onPress={() => Linking.openURL(APP.Github)}
        />
        <List.Item
          title={lang.settings_open_source_licence}
          description={lang.settings_open_source_licence_subtitle}
          onPress={() => SafeAction('License')}
        />
      </ScrollView>
      <Portal>
        <Dialog
          visible={showColour}
          dismissable={true}
          onDismiss={() => setShowColour(false)}>
          <Dialog.ScrollArea style={{maxHeight: 380, paddingHorizontal: 0}}>
            <FlatList
              bounces={false}
              data={colourList}
              keyExtractor={(_, index) => String(index)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{padding: 12, gap: 6}}
              renderItem={({item}) => (
                <Touchable
                  style={{
                    backgroundColor: item[500],
                    height: 48,
                    borderRadius: 12,
                  }}
                  onPress={() => updateTint(item)}
                />
              )}
            />
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
    </WoWsInfo>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  bottom: {position: 'absolute', left: 0, right: 0, bottom: 0},
  tint: {height: 36, width: 36, borderRadius: 18},
});

export default Settings;
