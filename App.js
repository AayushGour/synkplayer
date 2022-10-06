import React, { useEffect } from 'react'
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import TrackPlayer, { Capability } from 'react-native-track-player';
import { Provider } from 'react-redux';
import { FILE_STORAGE_DIRECTORY, THEME_BLUE_FOREGROUND, THEME_BLUE_FOREGROUND_TRANSPARENT } from './Constants';
import Icon from "react-native-vector-icons/AntDesign";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5"
import Main from './src/components/main/Main';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './src/store/store';
import Loader from './src/utility/loader/Loader';
import { PermissionsAndroid } from 'react-native-windows';

export default function App() {
  useEffect(() => {
    let setupPlayer = async () => {
      await TrackPlayer.setupPlayer({});

      await TrackPlayer.updateOptions({
        // Media controls capabilities
        capabilities: [
          Capability.SkipToPrevious,
          Capability.SkipToNext,
          Capability.Play,
          Capability.Pause,
          // Capability.Stop,
        ],

        // Capabilities that will show up when the notification is in the compact form on Android
        // compactCapabilities: [Capability.Play, Capability.Pause],
        // Icons for the notification on Android (if you don't like the default ones)
        // playIcon: <FontAwesome5Icon name="play" size={30} color={THEME_BLUE_FOREGROUND} />,
        // pauseIcon: <FontAwesome5Icon name="pause" size={30} color={THEME_BLUE_FOREGROUND} />,
        // stopIcon: require('./stop-icon.png'),
        // previousIcon: <Icon name="stepbackward" size={30} color={THEME_BLUE_FOREGROUND} />,
        // nextIcon: <Icon name="stepforward" size={30} color={THEME_BLUE_FOREGROUND} />,
        icon: require("./assets/images/SynkLogo.png")
      });
    };
    setupPlayer();
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
  }, []);

  return (
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={styles.container}>
          <StatusBar translucent={true} backgroundColor={THEME_BLUE_FOREGROUND_TRANSPARENT} style="light" />
          <Main />
        </SafeAreaView>
      </PersistGate>
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
