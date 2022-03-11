import React, { useState } from 'react'
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';
import { defaultStyles, ModalTypes, THEME_WHITE } from '../../../Constants';
import { connect } from "react-redux";
import { setModalContent, togglePlayer } from '../../store/actions';
import TrackPlayer, { State, useTrackPlayerEvents, Event as TrackPlayerEvents } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/FontAwesome5'

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
    TrackPlayerEvents.PlaybackState,
    TrackPlayerEvents.PlaybackError,
    TrackPlayerEvents.PlaybackTrackChanged
];

const Footer = (props) => {
    const [playerState, setPlayerState] = useState(null)
    const [trackTitle, setTrackTitle] = useState();

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
    return (
        <TouchableHighlight
            style={styles.footerTouchableContainer}
            onPress={() => props.togglePlayer(true)}
        >
            <View style={styles.footerContentContainer}>
                <View style={styles.detailContainer}>
                    <Text style={styles.songDetails}>{trackTitle || "-"}</Text>
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

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        togglePlayer: (value) => dispatch(togglePlayer(value)),
        setModalContent: (content) => dispatch(setModalContent(content))

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);