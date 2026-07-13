import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {SAVED, setLastLocation} from '../../value/data';
import {WoWsInfo, WikiIcon, SectionTitle} from '../../component';
import {SectionGrid} from 'react-native-super-grid';
import {SafeAction, copy} from '../../core';
import {lang} from '../../value/lang';
import {useAppStore} from '../../store/useAppStore';

const CommanderSkill = () => {
  useEffect(() => {
    setLastLocation('CommanderSkill');
    console.log('WIKI - Commander Skill');
  }, []);

  const initial = useMemo(() => {
    let skill = useAppStore.getState().getData(SAVED.commanderSkill);
    let cloned = copy(skill);
    let section: any[] = [];
    cloned.forEach((i: any) => {
      let index = i.tier - 1;
      if (!section[index]) {
        section.push({title: `${lang.wiki_skills_tier} ${i.tier}`, data: []});
      }
      section[index].data.push(Object.assign(i));
    });
    return section;
  }, []);

  const [data, setData] = useState(initial);
  const [point, setPoint] = useState(19);

  const skillSelected = useCallback((item: any) => {
    setPoint(prev => {
      if (item.selected == true) {
        let next = prev;
        if (next === lang.wiki_skills_reset) next = 0;
        next += item.tier;
        item.selected = false;
        setData(d => [...d]);
        return next;
      }
      let next = prev - item.tier;
      if (next >= 0) {
        item.selected = true;
        setData(d => [...d]);
        return next === 0 ? lang.wiki_skills_reset : next;
      }
      return prev;
    });
  }, []);

  const reset = useCallback(() => {
    setData(d => {
      d.forEach((i: any) => i.data.forEach((j: any) => delete j.selected));
      return [...d];
    });
    setPoint(19);
  }, []);

  return (
    <WoWsInfo
      title={`${point} ${lang.wiki_skills_point}`}
      onPress={reset}>
      <SectionGrid
        itemDimension={80}
        sections={data}
        renderItem={({item}) => (
          <WikiIcon
            item={item}
            selected={item.selected}
            onPress={() => skillSelected(item)}
            onLongPress={() => SafeAction('BasicDetail', {item: item})}
          />
        )}
        renderSectionHeader={({section}) => (
          <SectionTitle title={section.title} />
        )}
      />
    </WoWsInfo>
  );
};

export {CommanderSkill};
