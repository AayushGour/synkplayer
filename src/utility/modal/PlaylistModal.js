import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Modal, FlatList, TextInput, TouchableNativeFeedback, Button, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { THEME_BLUE_FOREGROUND, THEME_OFF_WHITE, THEME_WHITE, TRANSPARENT_BLACK } from '../../../Constants';
import { resetSelectedFiles, setSelectFile } from '../../store/actions';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const styles = StyleSheet.create({
    modalViewBackground: {
        height: "100%",
        width: "100%",
        backgroundColor: TRANSPARENT_BLACK,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContentContainer: {
        justifyContent: 'flex-start',
        minWidth: "50%",
        maxWidth: "80%",
        width: "80%",
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 2
        },
        borderWidth: 1,
        borderColor: THEME_BLUE_FOREGROUND,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: "#303030",
        alignItems: "center",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        maxHeight: "60%"
    },
    playlistTitleContainer: {
        padding: 10
    },
    playlistTitle: {
        color: THEME_WHITE,
        fontSize: 14,
        paddingVertical: 5,
    },
    textInput: {
        marginHorizontal: 5,
        paddingHorizontal: 5,
        paddingVertical: 3,
        marginVertical: 10,
        color: THEME_WHITE,
        width: "100%",
        borderBottomColor: THEME_BLUE_FOREGROUND,
        borderBottomWidth: 2
    },
})

const PlaylistModal = (props) => {
    const [playListData, setPlayListData] = useState([]);
    const [newPlaylist, setNewPlaylist] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");

    useEffect(() => {
        let playlist = Object.assign([], props.playlists);
        playlist?.push("create")
        playlist?.push({
            name: "test",
            tracks: [
                {
                    url: "someurl",
                    name: "somenem"
                }
            ]
        })
        setPlayListData(playlist);
    }, [])

    const createNewPlaylist = () => {
        props.setSelectFile(false);
        props.resetSelectedFiles();
        props.closeModal();
    }

    return (
        <Modal style={{ height: "100%", width: "100%" }}
            visible={props?.visible}
            animationType='fade'
            transparent={true}
            onRequestClose={() => {
                if (newPlaylist) {
                    setNewPlaylist(false);
                    return true;
                } else {
                    setNewPlaylist(false);
                    props.closeModal();
                    return true;
                }
            }}
        >
            <View style={styles.modalViewBackground}>
                <View style={styles.modalContentContainer} >
                    {newPlaylist ?
                        <View style={{ width: "100%", paddingVertical: 10 }}>
                            <TextInput
                                style={styles.textInput}
                                value={newPlaylistName}
                                onChangeText={(value) => setNewPlaylistName(value)}
                                placeholder="Playlist title..."
                                placeholderTextColor={"grey"}

                            />
                            <Button
                                title='Create'
                                disabled={newPlaylistName?.length === 0}
                                onPress={() => {
                                    createNewPlaylist();
                                }}
                            />
                        </View>
                        :
                        <FlatList
                            style={{ width: "100%" }}
                            data={playListData}
                            renderItem={({ item, index }) => {
                                if (item === "create") {
                                    return <TouchableNativeFeedback
                                        style={styles.playlistTitleContainer}
                                        onPress={() => setNewPlaylist(true)}
                                        background={TouchableNativeFeedback.Ripple(THEME_BLUE_FOREGROUND, false)}
                                    >
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Icon style={{ paddingRight: 5 }} name="playlist-plus" color={THEME_WHITE} size={24} />
                                            <Text style={styles.playlistTitle}>Create New Playlist</Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                } else {
                                    return <TouchableNativeFeedback
                                        style={styles.playlistTitleContainer}
                                        onPress={() => console.log("yoooo")}
                                        background={TouchableNativeFeedback.Ripple(THEME_BLUE_FOREGROUND, false)}
                                    >
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Icon style={{ paddingRight: 5 }} name="playlist-music" color={THEME_WHITE} size={24} />
                                            <Text style={styles.playlistTitle}>{item.name}</Text>

                                        </View>
                                    </TouchableNativeFeedback>
                                }
                            }}
                        />
                    }
                </View>
            </View>
        </Modal>
    )
}

const mapStateToProps = (state) => {
    return {
        playlists: state.playlist.playlists,
        selectedFiles: state.app.selectedFiles,
        selectFile: state.app.selectFile
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        resetSelectedFiles: () => dispatch(resetSelectedFiles()),
        setSelectFile: (value) => dispatch(setSelectFile(value))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PlaylistModal);