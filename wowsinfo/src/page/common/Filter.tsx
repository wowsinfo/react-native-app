/**
 * Filter.tsx
 *
 * Filter ships in wiki and player profile
 */

import React, {Component} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {lang} from '../../value/lang';
import {Button, Checkbox, List, TextInput} from 'react-native-paper';
import {ThemeColour, TintColour} from '../../value/colour';

interface FilterProps {
  applyFunc: () => void;
  resetFunc: () => void;
  wiki?: boolean;
}

interface FilterState {
  filter: boolean;
  tier: string;
  nation: string;
  type: string;
  name: string;
  premium: boolean;
  accordion: number;
}

class Filter extends Component<FilterProps, FilterState> {
  private tierList: string[];
  private nationList: string[];
  private typeList: string[];

  constructor(props: FilterProps) {
    super(props);

    this.state = {
      // Filter system
      filter: false,
      tier: lang.wiki_warship_filter_tier,
      nation: lang.wiki_warship_filter_nation,
      type: lang.wiki_warship_filter_type,
      name: '',
      premium: false,
      // 0 for none expanded
      accordion: 0,
    };

    this.tierList = [];
    this.nationList = [];
    this.typeList = [];
  }

  hideAccordion = (id: number): void => {
    const {accordion} = this.state;
    if (accordion === id) {
      this.setState({accordion: 0});
    } else {
      this.setState({accordion: id});
    }
  };

  render(): JSX.Element | null {
    const {input, apply} = styles;
    const {applyFunc, resetFunc, wiki} = this.props;

    if (wiki) {
      const {tier, nation, type, name, premium, accordion} = this.state;
      const textColour = TintColour()[500];

      return (
        <View style={{flex: 1, backgroundColor: ThemeColour()}}>
          <TextInput
            style={input}
            value={name}
            onChangeText={(text: string) => this.setState({name: text})}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder={lang.wiki_warship_filter_placeholder}
          />
          <List.Item
            title={lang.wiki_warship_filter_premium}
            onPress={() => this.setState({premium: !premium})}
            right={() => (
              <Checkbox status={premium ? 'checked' : 'unchecked'} />
            )}
          />
          <List.Accordion
            title={tier}
            expanded={accordion === 1}
            onPress={() => this.hideAccordion(1)}>
            <FlatList
              data={this.tierList}
              renderItem={({item}) => {
                return (
                  <Button
                    color={textColour}
                    style={{flex: 1}}
                    onPress={() => this.setState({tier: item, accordion: 0})}>
                    {item}
                  </Button>
                );
              }}
              numColumns={2}
              keyExtractor={(item: string) => item}
            />
          </List.Accordion>
          <List.Accordion
            title={nation}
            expanded={accordion === 2}
            onPress={() => this.hideAccordion(2)}>
            <FlatList
              data={this.nationList}
              renderItem={({item}) => {
                return (
                  <Button
                    color={textColour}
                    style={{flex: 1}}
                    onPress={() => this.setState({nation: item, accordion: 0})}>
                    {item}
                  </Button>
                );
              }}
              numColumns={2}
              keyExtractor={(item: string) => item}
            />
          </List.Accordion>
          <List.Accordion
            title={type}
            expanded={accordion === 3}
            onPress={() => this.hideAccordion(3)}>
            <FlatList
              data={this.typeList}
              renderItem={({item}) => {
                return (
                  <Button
                    color={textColour}
                    style={{flex: 1}}
                    onPress={() => this.setState({type: item, accordion: 0})}>
                    {item}
                  </Button>
                );
              }}
              numColumns={2}
              keyExtractor={(item: string) => item}
            />
          </List.Accordion>
          <Button style={apply} onPress={() => resetFunc()}>
            {lang.wiki_warship_reset_btn}
          </Button>
          <Button style={apply} onPress={() => applyFunc()}>
            {lang.wiki_warship_filter_btn}
          </Button>
        </View>
      );
    }

    return null;
  }
}

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
