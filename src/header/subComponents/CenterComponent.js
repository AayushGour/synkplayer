
import AppLoading from 'expo-app-loading';
import * as Font from "expo-font";
import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { customFonts, THEME_WHITE } from '../../../Constants';

const styles = StyleSheet.create({
    synkLogoStyles: {
        marginRight: 6,
        marginLeft: 0,
        height: 24,
        width: 24,
    },
    synkTextStyles: {
        fontFamily: 'Montserrat',
        color: THEME_WHITE,
        fontSize: 16
    }
})

class CenterComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false
        };
    }
    componentDidMount = () => {
        this.loadFonts();
    }

    loadFonts = async () => {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true })
    }
    render() {
        return (
            (this.state.fontsLoaded ?
                <View style={{
                    display: "flex",
                    flexDirection: "row"
                }}>
                    <Image
                        source={require('../../assets/images/SynkLogo.png')}
                        style={styles.synkLogoStyles}
                    />
                    <Text
                        style={styles.synkTextStyles}
                    >Synk Player</Text>
                </View>
                : <AppLoading />)
        );
    }
}

export default CenterComponent;