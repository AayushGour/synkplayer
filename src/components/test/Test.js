import React, { Component } from 'react';
import { View, Text, Animated, PanResponder, Button } from 'react-native';
import Sound from "react-native-sound";
import TrackPlayer, { State } from 'react-native-track-player';
import * as Animatable from "react-native-animatable";
import ytdl from 'react-native-ytdl';
import ytsr from "react-native-ytsr";

const Test = (props) => {
    return (
        <View style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
            <Button title={"Pause"} onPress={async () => {
                await TrackPlayer.pause();
            }} />
            <Button title={"Reset list"} onPress={async () => {
                await TrackPlayer.reset()
            }} />
            <Button title={"Print list"} onPress={async () => {
                await TrackPlayer.getQueue().then(e => console.log(e))
            }} />
            <Button title={"Youtube download"} onPress={async () => {
                const youtubeURL = 'http://www.youtube.com/watch?v=04GiqLjRO3A';
                const urls = await ytdl(youtubeURL, { quality: 'highestaudio' });
                console.log(urls)
                await TrackPlayer.reset();
                await TrackPlayer.add(urls);
                await TrackPlayer.play()
            }} />
            <Button title={"Youtube Search"} onPress={async () => {
                let search = await ytsr("blastoyz")
                console.log(search)
            }} />

        </View>
    );

}

export default Test;