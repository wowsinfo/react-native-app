import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';

export interface CustomStatusBarProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  dark?: boolean;
}

/**
 * A custom status bar that can be used to change the background color of the status bar on iOS
 */
export const CustomStatusBar = ({
  children,
  backgroundColor,
  dark,
}: CustomStatusBarProps) => {
  // SafeAreaView will fill the status bar with the background color
  // StatusBar will change the text color to white and overwrite the previous style
  return (
    <View style={styles.container}>
      <SafeAreaView style={{backgroundColor: backgroundColor}} />
      {children}
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
  },
  customBar: {
    backgroundColor: 'green',
  },
});
