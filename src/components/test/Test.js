import React, { Component } from 'react';
import { View, Text, Animated, PanResponder, Button } from 'react-native';
import Sound from "react-native-sound";
import TrackPlayer, { State } from 'react-native-track-player';
import * as Animatable from "react-native-animatable";

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount = async () => {
        // TrackPlayer.play();
    }
    render() {
        return (
            <View style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
                <Button title={"Play/Pause"} onPress={async () => {
                    let state = await TrackPlayer.getState();
                    if (state === State.Playing) {
                        TrackPlayer.pause();
                    } else {
                        TrackPlayer.play();
                    }
                }} />
                <Text>Hello</Text>
            </View>
        );
    }
}

export default Test;