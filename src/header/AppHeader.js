import React, { Component } from 'react';
import { Text } from 'react-native';
import { Header } from "react-native-elements/dist/header/Header";
import CenterComponent from './subComponents/CenterComponent';

class AppHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <Header
                // backgroundColor={THEME_BLUE_FOREGROUND}
                placement="left"
                leftComponent={{ icon: "menu", color: '#fff' }}
                centerComponent={<CenterComponent />}
                // rightComponent={{ icon: 'home', color: '#fff' }}
                containerStyle={{ height: 65 }}
            />
        );
    }
}

export default AppHeader;