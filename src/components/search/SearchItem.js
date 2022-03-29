import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import * as RNFS from "react-native-fs";
import Icon from "react-native-vector-icons/AntDesign";
import ytdl from 'react-native-ytdl';
import { connect } from 'react-redux';
import { FILE_STORAGE_DIRECTORY, THEME_BLUE_FOREGROUND, THEME_OFF_WHITE, THEME_WHITE, TRANSPARENT_BLACK } from '../../../Constants';
import { toggleLoader } from '../../store/actions';
import { addTrackToTrackRecords } from '../../utility/store/action';
import { playTrack } from '../player/service';
import { displayError } from '../services/ErrorHandler';

const styles = StyleSheet.create({

    listItemContainer: {
        width: "100%",
        borderBottomColor: THEME_OFF_WHITE,
        borderBottomWidth: 1,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    listItemDetailsContainer: {
        paddingLeft: 10,
        flex: 1
    },
    listItemTitle: {
        color: THEME_WHITE,
        fontSize: 16,
        paddingBottom: 5
    },
    durationText: {
        color: THEME_WHITE,
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: TRANSPARENT_BLACK,
        padding: 5,
        borderRadius: 5
    },
    downloadPercentageText: {
        color: THEME_WHITE,
        position: 'absolute',
        fontSize: 12
    }
})

const SearchItem = (props) => {

    const [loading, setLoading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [progress, setProgress] = useState(0)

    const handleClick = async (item) => {
        try {
            if (props.trackRecords?.some(elem => elem?.id === item?.id)) {
                let track = props.trackRecords?.find(elem => elem?.id === item?.id);
                setDownloaded(true)
                playTrack(track);
            } else {
                setLoading(true);
                let youtubeURL = item?.url;

                let fileDownloadInfo = await ytdl.getInfo(youtubeURL, { quality: "highestaudio", filter: "audio" });
                let format = ytdl.chooseFormat(fileDownloadInfo.formats, { quality: 'highestaudio', filter: "audio" });
                console.log(format, fileDownloadInfo)
                let downloadOptions = {
                    fromUrl: format?.url,
                    toFile: `${FILE_STORAGE_DIRECTORY}/${item?.title}.${format?.container}`,
                    background: true,
                    cacheable: false,
                    progressDivider: 1,
                    progress: (res) => { setProgress(Math.ceil((res?.bytesWritten / res?.contentLength) * 100)) }
                }
                let download = RNFS.downloadFile(downloadOptions)
                download.promise.then(resp => {
                    setLoading(false);
                    setDownloaded(true);
                    let videoItem = {
                        id: item?.id,
                        url: `${FILE_STORAGE_DIRECTORY}/${item?.title}.${format?.container}`,
                        title: item?.title,
                        artist: item?.author?.name,
                        artwork: item?.bestThumbnail?.url
                    }
                    props.addTrackToTrackRecords(videoItem);
                    playTrack(videoItem);
                })

            }
        } catch (error) {
            console.error(error);
            displayError(error)
        }

    }
    return (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(THEME_BLUE_FOREGROUND, false)}
            onPress={() => handleClick(props.item)}
        >
            <View style={styles.listItemContainer}>
                <View style={{ position: "relative" }}>
                    <Image style={{ aspectRatio: 16 / 9, height: 70 }} source={{ uri: props?.item?.bestThumbnail?.url }} />
                    <Text style={styles.durationText}>{props?.item?.duration}</Text>
                </View>
                <View style={styles.listItemDetailsContainer}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.listItemTitle}>{props?.item?.title}</Text>
                    <Text style={{ color: THEME_OFF_WHITE }}>{props?.item?.author?.name}</Text>
                </View>
                {loading && !downloaded ?
                    <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size={45} color={THEME_WHITE} />
                        <Text style={styles.downloadPercentageText}>{progress}%</Text>
                    </View>
                    : !loading && downloaded ? <Icon size={25} name="check" color="#62bd69" /> : null}
            </View>
        </TouchableNativeFeedback>);
}
const mapStateToProps = (state) => {
    return {
        trackRecords: state.data.trackRecords
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        toggleLoader: (value) => dispatch(toggleLoader(value)),
        addTrackToTrackRecords: (track) => dispatch(addTrackToTrackRecords(track))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchItem);