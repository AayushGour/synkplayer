import React, { Component, useEffect, useState, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, Button, PanResponder, View } from 'react-native';
import * as Animatable from "react-native-animatable";
import { connect } from "react-redux";
import { defaultStyles, ModalTypes, THEME_BLACK_BACKGROUND, THEME_BLUE_FOREGROUND, THEME_WHITE } from '../../../Constants';
import { setModalContent, togglePlayer } from '../../store/actions';
import Icon from "react-native-vector-icons/AntDesign";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5"
import { formatTime, handlePlayerSwipe, playNext, playPrevious } from './service';
import TrackPlayer, { useProgress, useTrackPlayerEvents, Event as TrackPlayerEvents, State } from 'react-native-track-player';
import Slider from '@react-native-community/slider';

const styles = StyleSheet.create({
    playerContainer: {
        width: "100%",
        height: "100%",
        backgroundColor: "#0009",
        position: 'absolute',
        elevation: 3,
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
        justifyContent: "center"
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
        paddingHorizontal: 10
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
    TrackPlayerEvents.PlaybackState,
    TrackPlayerEvents.PlaybackError,
    TrackPlayerEvents.PlaybackTrackChanged
];

const Player = (props) => {
    const [playerState, setPlayerState] = useState(null)
    const playerContainer = useRef();
    const pan = useRef(new Animated.ValueXY()).current;
    const [trackTitle, setTrackTitle] = useState();
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
        if (event.type === TrackPlayerEvents.PlaybackError) {
            props.setModalContent({ visible: true, content: "An error occured while playing the current track.", type: ModalTypes.WARNING })
        }
        if (event.type === TrackPlayerEvents.PlaybackState) {
            setPlayerState(event.state);
        }
        if (event.type === TrackPlayerEvents.PlaybackTrackChanged && event.nextTrack !== null) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            const { title } = track || {};
            setTrackTitle(title);
        }
    });

    const isPlaying = playerState === State.Playing;

    useEffect(() => {
        let translateVal = props.displayPlayer ? 0 : Dimensions.get("screen").height;
        playerContainer?.current?.transitionTo({ translateY: translateVal })
    }, [props.displayPlayer])




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
            <Button title="Click" onPress={() => props.togglePlayer(false)} />
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
                    <View>
                        <Text style={{ color: THEME_WHITE }}>{trackTitle}</Text>
                    </View>
                    <View style={styles.playerFooter}>
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
                                    size={30}
                                    style={[defaultStyles.iconButtonStyle, { marginHorizontal: 10 }]}
                                    iconStyle={defaultStyles.iconButtonIconStyle}
                                    color={THEME_WHITE}
                                    backgroundColor="transparent"
                                    onPress={() => { TrackPlayer.pause() }}
                                />
                                :
                                <FontAwesome5Icon.Button name="play"
                                    size={30}
                                    style={[defaultStyles.iconButtonStyle, { marginHorizontal: 10 }]}
                                    iconStyle={defaultStyles.iconButtonIconStyle}
                                    color={THEME_WHITE}
                                    backgroundColor="transparent"
                                    onPress={() => { TrackPlayer.play() }}
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
                </Animatable.View>
            </View>
        </Animatable.View>
    </>

    );
}

const mapStateToProps = (state) => {
    return {
        displayPlayer: state.app.displayPlayer
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        togglePlayer: (value) => dispatch(togglePlayer(value)),
        setModalContent: (content) => dispatch(setModalContent(content))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);