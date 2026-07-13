import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Linking} from 'react-native';
import {
  Button,
  List,
  Paragraph,
  FAB,
  Text,
  Headline,
  Title,
  Subheading,
} from 'react-native-paper';
import {Actions} from '../../core/navigation/Actions';
import {lang} from '../../value/lang';
import {
  APP,
  SERVER,
  getCurrServer,
  setCurrServer,
  setAPILanguage,
} from '../../value/data';
import {Downloader} from '../../core';
import {WoWsInfo, SectionTitle, LoadingIndicator} from '../../component';
import {TintBackgroundColour} from '../../value/colour';

const Setup = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [server] = useState(SERVER);
  const [selectedServer, setSelectedServer] = useState(3);
  const [langList, setLangList] = useState([]);
  const [langData, setLangData] = useState([]);
  const [selectedLang, setSelectedLang] = useState('en');

  useEffect(() => {
    (async () => {
      const data = await new Downloader(getCurrServer()).getLanguage();
      if (data) {
        setLangList(data);
        setLangData(Object.keys(data).sort());
        setLoading(false);
      } else {
        setError(true);
      }
    })();
  }, []);

  const updateServer = (index: number) => {
    setCurrServer(index);
    setSelectedServer(index);
  };

  const updateApiLanguage = (lang: string) => {
    setAPILanguage(lang);
    setSelectedLang(lang);
  };

  const finishSetup = () => {
    Actions.reset('Menu');
  };

  const renderAPILanguage = () => {
    if (loading) {
      return <LoadingIndicator />;
    }
    if (error) {
      return (
        <View>
          <Paragraph style={styles.titleStyle}>{lang.error_download_issue}</Paragraph>
          <List.Item
            title={lang.settings_app_send_feedback}
            description={lang.settings_app_send_feedback_subtitle}
            onPress={() => Linking.openURL(APP.Developer)}
          />
        </View>
      );
    }

    return (
      <View style={styles.wrapView}>
        {langData.map(item => (
          <Button key={item} onPress={() => updateApiLanguage(item)}>
            {langList[item]}
          </Button>
        ))}
      </View>
    );
  };

  return (
    <WoWsInfo hideAds empty>
      <ScrollView contentContainerStyle={styles.scroll}>
        <SectionTitle title={lang.settings_api_settings} center bold />
        <Subheading style={styles.titleStyle}>
          {`${lang.setting_game_server}: ${lang.server_name[selectedServer]}`}
        </Subheading>
        <View style={styles.wrapView}>
          {server.slice(1).map((_, index) => (
            <Button key={index} onPress={() => updateServer(index + 1)}>
              {lang.server_name[index + 1]}
            </Button>
          ))}
        </View>
        <Subheading style={styles.titleStyle}>
          {`${lang.setting_api_language}: ${langList[selectedLang] ?? ''}`}
        </Subheading>
        {renderAPILanguage()}
      </ScrollView>
      <FAB
        visible={!loading}
        icon="check"
        color="white"
        style={[styles.fab, {backgroundColor: TintBackgroundColour()}]}
        label={lang.setup_done_button}
        onPress={loading ? undefined : finishSetup}
      />
    </WoWsInfo>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: '15%',
  },
  top: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    margin: 16,
  },
  titleStyle: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 16,
  },
  wrapView: {
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});

export {Setup};
