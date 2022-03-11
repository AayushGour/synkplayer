import React, { useEffect } from 'react'
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import TrackPlayer, { Capability } from 'react-native-track-player';
import { Provider } from 'react-redux';
import { THEME_BLUE_FOREGROUND } from './Constants';
import Icon from "react-native-vector-icons/AntDesign";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5"
import Main from './src/components/main/Main';
import store from './src/store/store';

export default function App() {
  useEffect(() => {
    async () => {
      await TrackPlayer.setupPlayer({}).then(async () => {
        await TrackPlayer.updateOptions({
          // Media controls capabilities
          capabilities: [
            Capability.SkipToPrevious,
            Capability.SkipToNext,
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
          ],

          // Capabilities that will show up when the notification is in the compact form on Android
          // compactCapabilities: [Capability.Play, Capability.Pause],
          // Icons for the notification on Android (if you don't like the default ones)
          // playIcon: <FontAwesome5Icon name="play" size={30} color={THEME_BLUE_FOREGROUND} />,
          // pauseIcon: <FontAwesome5Icon name="pause" size={30} color={THEME_BLUE_FOREGROUND} />,
          // stopIcon: require('./stop-icon.png'),
          // previousIcon: <Icon name="stepbackward" size={30} color={THEME_BLUE_FOREGROUND} />,
          // nextIcon: <Icon name="stepforward" size={30} color={THEME_BLUE_FOREGROUND} />,
          // icon: require('./notification-icon.png')
        });
      });
    }
  }, [])
  return (
    <Provider store={store} >
      <SafeAreaView style={styles.container}>
        <StatusBar translucent={true} backgroundColor={THEME_BLUE_FOREGROUND} style="light" />
        <Main />
      </SafeAreaView>
    </Provider>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
});
