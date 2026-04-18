import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';

export const FloatingButton = () => {
  const [menu, setMenu] = useState(false);
  const [icon, setIcon] = useState<any>({uri: 'Ship'});

  useEffect(() => {
    // @ts-ignore
    const hasMenu = Actions.state.routes.findIndex(r => r.routeName === 'Menu');
    setMenu(hasMenu > 0);
    setIcon(hasMenu > 0 ? 'home' : {uri: 'Ship'});
  }, []);

  const navigate = () => {
    if (menu) {
      Actions.popTo('Menu');
    } else if (Actions.currentScene !== 'Menu') {
      Actions.Menu();
    }
  };

  const {container} = styles;

  return (
    <SafeAreaView style={container}>
      <FAB onPress={navigate} icon={icon} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
