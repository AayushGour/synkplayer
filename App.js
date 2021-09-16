import React from 'react';
import {
  SafeAreaView, StatusBar,
  StyleSheet
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from "./src/header/AppHeader"
import Home from "./src/home/Home"
import { THEME_BLACK_BACKGROUND, THEME_WHITE } from './Constants';

function App() {
  return (
    <SafeAreaView
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        flex: 1,
        alignItems: "center",
        backgroundColor: THEME_BLACK_BACKGROUND,
      }}
    >
      <LinearGradient colors={[THEME_BLACK_BACKGROUND, "#01a4e9aa", THEME_WHITE]} locations={[0.8, 0.95, 1]}>
        <StatusBar backgroundColor="transparent" />
        <AppHeader />
      </LinearGradient>
      <Home />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
