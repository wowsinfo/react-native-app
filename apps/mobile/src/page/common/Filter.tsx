import React, {useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {lang} from '../../value/lang';
import {Button, Checkbox, List, TextInput} from 'react-native-paper';
import {getThemeColour, getTintTextColour} from '../../value/colour';

const textColour = getTintTextColour().color;
const tierList: string[] = [];
const nationList: string[] = [];
const typeList: string[] = [];

const Filter = ({applyFunc, resetFunc, wiki}: {applyFunc?: (d: Record<string, unknown>) => void; resetFunc?: () => void; wiki?: boolean}) => {
  const [filter, setFilter] = useState(false);
  const [tier, setTier] = useState(lang.wiki_warship_filter_tier);
  const [nation, setNation] = useState(lang.wiki_warship_filter_nation);
  const [type, setType] = useState(lang.wiki_warship_filter_type);
  const [name, setName] = useState('');
  const [premium, setPremium] = useState(false);
  const [accordion, setAccordion] = useState(0);

  const hideAccordion = (index: number) => {
    setAccordion(accordion === index ? 0 : index);
  };

  if (wiki) {
    return (
      <View style={{flex: 1, backgroundColor: getThemeColour()}}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder={lang.wiki_warship_filter_placeholder}
        />
        <List.Item
          title={lang.wiki_warship_filter_premium}
          onPress={() => setPremium(!premium)}
          right={() => <Checkbox status={premium ? 'checked' : 'unchecked'} />}
        />
        <List.Accordion
          title={tier}
          expanded={accordion === 1}
          onPress={() => hideAccordion(1)}>
          <FlatList
            data={tierList}
            renderItem={({item}) => (
              <Button
                color={textColour}
                style={{flex: 1}}
                onPress={() => {
                  setTier(item);
                  setAccordion(0);
                }}>
                {item}
              </Button>
            )}
            numColumns={2}
            keyExtractor={item => item}
          />
        </List.Accordion>
        <List.Accordion
          title={nation}
          expanded={accordion === 2}
          onPress={() => hideAccordion(2)}>
          <FlatList
            data={nationList}
            renderItem={({item}) => (
              <Button
                color={textColour}
                style={{flex: 1}}
                onPress={() => {
                  setNation(item);
                  setAccordion(0);
                }}>
                {item}
              </Button>
            )}
            numColumns={2}
            keyExtractor={item => item}
          />
        </List.Accordion>
        <List.Accordion
          title={type}
          expanded={accordion === 3}
          onPress={() => hideAccordion(3)}>
          <FlatList
            data={typeList}
            renderItem={({item}) => (
              <Button
                color={textColour}
                style={{flex: 1}}
                onPress={() => {
                  setType(item);
                  setAccordion(0);
                }}>
                {item}
              </Button>
            )}
            numColumns={2}
            keyExtractor={item => item}
          />
        </List.Accordion>
        <Button style={styles.apply} onPress={() => resetFunc()}>
          {lang.wiki_warship_reset_btn}
        </Button>
        <Button style={styles.apply} onPress={() => applyFunc()}>
          {lang.wiki_warship_filter_btn}
        </Button>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    padding: 4,
  },
  apply: {
    padding: 8,
  },
});

export {Filter};
