/**
 * Filter.js
 *
 * Filter ships in wiki and player profile
 */

import React, {Component} from 'react';
import {View, FlatList} from 'react-native';
import {lang} from '../../value/lang';
import {Button, Checkbox, List, TextInput} from 'react-native-paper';
import {ThemeColour} from '../../value/colour';

class Filter extends Component {
  constructor(props) {
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
  }

  render() {
    const {applyFunc, resetFunc, wiki} = this.props;

    if (wiki) {
      const {filter, tier, nation, type, name, premium, accordion} = this.state;

      return (
        <View style={{flex: 1, backgroundColor: ThemeColour()}}>
          <TextInput
            style={{padding: 4}}
            value={name}
            onChangeText={text => this.setState({name: text})}
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
              keyExtractor={item => item}
            />
          </List.Accordion>
          <List.Accordion
            title={nation}
            expanded={accordion === 2}
            onPress={() => this.hideAccordion(2)}>
            <FlatList
              data={nationList}
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
              keyExtractor={item => item}
            />
          </List.Accordion>
          <List.Accordion
            title={type}
            expanded={accordion === 3}
            onPress={() => this.hideAccordion(3)}>
            <FlatList
              data={typeList}
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
              keyExtractor={item => item}
            />
          </List.Accordion>
          <Button style={{padding: 8}} onPress={() => resetFunc()}>
            {lang.wiki_warship_reset_btn}
          </Button>
          <Button style={{padding: 8}} onPress={() => applyFunc()}>
            {lang.wiki_warship_filter_btn}
          </Button>
        </View>
      );
    }
  }
}

export {Filter};
