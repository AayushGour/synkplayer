import React, { Component, useEffect, useState, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, Button, PanResponder, View, Image, ImageBackground, Platform, StatusBar } from 'react-native';
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";
import { defaultStyles, ModalTypes, THEME_BLACK_BACKGROUND, THEME_BLUE_FOREGROUND, THEME_BLUE_FOREGROUND_TRANSPARENT, THEME_WHITE, TRANSPARENT_BLACK } from '../../../Constants';
import { setCurrentTrack, setModalContent, togglePlayer } from '../../store/actions';
import Icon from "react-native-vector-icons/AntDesign";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5"
import { formatTime, handlePlayerSwipe, playNext, playPrevious, playTrackWithIndex } from './service';
import Slider from '@react-native-community/slider';
import TrackPlayer, { State, Event, useTrackPlayerEvents, useProgress } from 'react-native-track-player';
import { displayWarning } from '../services/ErrorHandler';
import Logo from "../../../assets/images/venom.png";
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
    playerContainer: {
        width: "100%",
        height: "100%",
        backgroundColor: "#000a",
        position: 'absolute',
        elevation: 3,
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0

    },
    backdrop: {
        position: "absolute",
        top: "50%",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    playerContentContainer: {
        height: "100%",
        width: "100%"
    },
    playerFooter: {
        width: "100%",
        justifyContent: "center",
        paddingVertical: 10,
        // backgroundColor: "#0005"
    },
    buttonContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    sliderContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    slider: {
        flex: 1,
        height: 40
    },
    sliderText: {
        color: THEME_WHITE
    }
})
const events = [
    Event.PlaybackError,
    Event.PlaybackState,
    Event.PlaybackTrackChanged
];

const Player = (props) => {
    const playerContainer = useRef();
    const pan = useRef(new Animated.ValueXY()).current;
    const [playerState, setPlayerState] = useState(null)
    const progress = useProgress();
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([
            null,
            {
                dx: pan.x, // x,y are Animated.Value
                // dy: pan.y,
            },
        ], { useNativeDriver: false }),
        onPanResponderRelease: () => {
            Animated.spring(
                pan, // Auto-multiplexed
                { toValue: { x: 0, y: 0 }, speed: 100, bounciness: 0, useNativeDriver: true, isInteraction: false }
            ).start(() => {
                handlePlayerSwipe(pan.x._value);
                pan.setValue({ x: 0, y: 0 });
            });
        },
    });

    useTrackPlayerEvents(events, async (event) => {
        if (event.type === Event.PlaybackError) {
            displayWarning(`${event?.code}: ${event?.message}`)
        }
        if (event.type === Event.PlaybackState) {
            setPlayerState(event.state);
        }
        if (event.type === Event.PlaybackTrackChanged) {
            // setPlayerState(event.state);
            console.log(event)
            !!event.nextTrack && playTrackWithIndex(event?.nextTrack)
        }
    });

    const isPlaying = playerState === State.Playing;

    //listener for display player
    useEffect(() => {
        let translateVal = props.displayPlayer ? 0 : Dimensions.get("window").height;
        playerContainer?.current?.transitionTo({ translateY: translateVal })
    }, [props.displayPlayer])


    useEffect(() => {
        console.log("player current track", props.currentTrack)
    }, [props.currentTrack])

    return (<>
        <Animatable.View
            useNativeDriver={true}
            style={styles.playerContainer}
            ref={playerContainer}
        >
            <View style={styles.backdrop}>
                <Animated.View style={{
                    opacity: pan.x.interpolate({
                        inputRange: [0, 100],
                        outputRange: [0, 1]
                    })
                }}>
                    <Icon name="stepbackward" size={30} color={THEME_BLUE_FOREGROUND} />
                    <Text style={{ color: THEME_WHITE, paddingTop: 10 }}>Previous</Text>
                </Animated.View>
                <Animated.View style={{
                    opacity: pan.x.interpolate({
                        inputRange: [-100, 0],
                        outputRange: [1, 0]
                    })
                }}>
                    <Icon name="stepforward" size={30} color={THEME_BLUE_FOREGROUND} />
                    <Text style={{ color: THEME_WHITE, paddingTop: 10 }}>Next</Text>
                </Animated.View>
            </View>
            {/* <Button title="Click" onPress={() => props.togglePlayer(false)} /> */}
            {/* Main Player Content */}
            <View style={{ width: "100%", flex: 1, alignItems: "center", justifyContent: "flex-start" }}>
                <Animatable.View
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: THEME_BLACK_BACKGROUND,
                        transform: [{ translateX: pan.x }]
                    }}
                    {...panResponder.panHandlers}
                    useNativeDriver={true}
                >
                    <ImageBackground style={{ flex: 1 }} blurRadius={5} source={!!props.currentTrack?.artwork ? { uri: props.currentTrack?.artwork } : Logo} >
                        <View style={{ position: "absolute", top: 0, right: 0, margin: 10 }}>
                            <FontAwesome5Icon.Button name="chevron-down" backgroundColor="transparent" style={defaultStyles.iconButtonStyle} iconStyle={defaultStyles.iconButtonIconStyle} size={30} color={THEME_WHITE} onPress={() => props.togglePlayer()} />
                        </View>
                        <View style={{ flex: 1, padding: 20, alignItems: "center", justifyContent: "center" }}>
                            <Image resizeMode='contain' style={{ alignItems: "center", justifyContent: "center", width: "100%", maxWidth: "100%", maxHeight: "100%", aspectRatio: 16 / 9 }} source={!!props.currentTrack?.artwork ? { uri: props.currentTrack?.artwork } : 0} defaultSource={Logo} />
                        </View>
                        <LinearGradient colors={["#0005", "#000", THEME_BLUE_FOREGROUND]} locations={[0, 0.95, 1]}>
                            <View style={styles.playerFooter}>
                                <Text style={{ color: THEME_WHITE, paddingHorizontal: 10, fontSize: 16, paddingTop: 5 }} numberOfLines={1} ellipsizeMode="tail">{props?.currentTrack?.title || "-"}</Text>
                                <Text style={{ color: THEME_WHITE, paddingHorizontal: 10, paddingTop: 5 }} numberOfLines={1} ellipsizeMode="tail">{props?.currentTrack?.artist || "-"}</Text>
                                <View style={styles.sliderContainer}>
                                    <Text style={styles.sliderText}>{formatTime(progress.position)}</Text>
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={0}
                                        maximumValue={progress.duration}
                                        step={1}
                                        value={progress.position}
                                        minimumTrackTintColor={THEME_BLUE_FOREGROUND}
                                        maximumTrackTintColor={THEME_WHITE}
                                        thumbTintColor={THEME_BLUE_FOREGROUND}
                                        onSlidingComplete={(seconds) => TrackPlayer.seekTo(seconds)}
                                    />
                                    <Text style={styles.sliderText}>{formatTime(progress.duration)}</Text>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <Icon.Button name="stepbackward"
                                        size={30}
                                        style={[defaultStyles.iconButtonStyle, { marginHorizontal: 10 }]}
                                        iconStyle={defaultStyles.iconButtonIconStyle}
                                        color={THEME_WHITE}
                                        backgroundColor="transparent"
                                        onPress={() => { playPrevious() }}
                                    />
                                    {isPlaying ?
                                        <FontAwesome5Icon.Button name="pause"
                                            size={40}
                                            style={[defaultStyles.iconButtonStyle, { marginHorizontal: 10 }]}
                                            iconStyle={defaultStyles.iconButtonIconStyle}
                                            color={THEME_WHITE}
                                            backgroundColor="transparent"
                                            onPress={() => { //pause
                                                TrackPlayer.pause()
                                            }}
                                        />
                                        :
                                        <FontAwesome5Icon.Button name="play"
                                            size={40}
                                            style={[defaultStyles.iconButtonStyle, { marginHorizontal: 10 }]}
                                            iconStyle={defaultStyles.iconButtonIconStyle}
                                            color={THEME_WHITE}
                                            backgroundColor="transparent"
                                            onPress={() => { //play
                                                TrackPlayer.play();
                                            }}
                                        />
                                    }
                                    <Icon.Button name="stepforward"
                                        size={30}
                                        style={[defaultStyles.iconButtonStyle, { marginHorizontal: 10 }]}
                                        iconStyle={defaultStyles.iconButtonIconStyle}
                                        color={THEME_WHITE}
                                        backgroundColor="transparent"
                                        onPress={() => { playNext() }}
                                    />
                                </View>
                            </View>

                        </LinearGradient>
                    </ImageBackground>

                </Animatable.View>
            </View>
        </Animatable.View>
    </>

    );
}

const mapStateToProps = (state) => {
    return {
        displayPlayer: state.app.displayPlayer,
        currentTrack: state.app.currentTrack
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        togglePlayer: (value) => dispatch(togglePlayer(value)),
        setModalContent: (content) => dispatch(setModalContent(content)),
        setCurrentTrack: (trackDetails) => dispatch(setCurrentTrack(trackDetails))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);