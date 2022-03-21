import React, { useState } from 'react'
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';
import { defaultStyles, ModalTypes, THEME_WHITE } from '../../../Constants';
import { connect } from "react-redux";
import { setModalContent, togglePlayer } from '../../store/actions';
import Icon from 'react-native-vector-icons/FontAwesome5'
import TrackPlayer, { Event, useTrackPlayerEvents, State } from 'react-native-track-player';
import { displayWarning } from '../services/ErrorHandler';

const styles = StyleSheet.create({
    footerTouchableContainer: {
        // position: 'absolute',
        width: "100%",
        height: 60,
        borderTopColor: THEME_WHITE,
        borderTopWidth: 2,
        bottom: 0,
    },
    footerContentContainer: {
        width: "100%",
        height: "100%",
        // backgroundColor: "red",
        flexDirection: "row"
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        height: 60,
    },
    detailContainer: {
        flex: 3,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    songDetails: {
        color: THEME_WHITE
    }
})

const events = [
    Event.PlaybackState,
    Event.PlaybackError
];

const Footer = (props) => {
    const [playerState, setPlayerState] = useState(null)

    useTrackPlayerEvents(events, async (event) => {
        if (event.type === Event.PlaybackError) {
            displayWarning(`${event?.code}: ${event?.message}`)
        }
        if (event.type === Event.PlaybackState) {
            setPlayerState(event.state);
        }
    });

    const isPlaying = playerState === State.Playing;
    return (
        <TouchableHighlight
            style={styles.footerTouchableContainer}
            onPress={() => props.togglePlayer(true)}
        >
            <View style={styles.footerContentContainer}>
                <View style={styles.detailContainer}>
                    <Text style={styles.songDetails}>{props?.currentTrack?.title || "-"}</Text>
                </View>
                <TouchableHighlight style={styles.iconContainer}>
                    {isPlaying ?
                        <Icon.Button name='pause' iconStyle={defaultStyles.iconButtonIconStyle} style={defaultStyles.iconButtonStyle} size={30} color={THEME_WHITE} backgroundColor="transparent" onPress={() => { TrackPlayer.pause() }} />
                        :
                        <Icon.Button name='play' iconStyle={defaultStyles.iconButtonIconStyle} style={defaultStyles.iconButtonStyle} size={30} color={THEME_WHITE} backgroundColor="transparent" onPress={() => { TrackPlayer.play() }} />
                    }
                </TouchableHighlight>
            </View>
        </TouchableHighlight>
    )
}

const mapStateToProps = (state) => {
    return {
        currentTrack: state.app.currentTrack
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        togglePlayer: (value) => dispatch(togglePlayer(value)),
        setModalContent: (content) => dispatch(setModalContent(content))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);