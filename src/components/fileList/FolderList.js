import React, { Component } from 'react';
import { Button, DeviceEventEmitter, FlatList, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import * as RNFS from 'react-native-fs';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import { ADD_TO_PLAYLIST_MENU_ITEM, SELECT_ALL_MENU_ITEM, TEXT_DISABLED, THEME_BLUE_FOREGROUND, THEME_BLUE_FOREGROUND_TRANSPARENT, THEME_WHITE } from '../../../Constants';
import CheckBox from '@react-native-community/checkbox';
import { playTrackWithPath } from '../player/service';
import { connect } from 'react-redux';
import { setSelectedFiles } from '../../store/actions';

const styles = StyleSheet.create({
    fileListContainer: {
        width: "100%",
        flex: 1
    },
    backButton: {
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        paddingLeft: 10,
        paddingRight: 2,
    },
    currentPathLabelContainer: {
        // paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: "row",
        alignItems: "center"
    },
    currentPathLabel: {
        color: THEME_WHITE,
        marginLeft: 10,
        flex: 1,
        width: "80%",
    },
    selectedFileCount: {
        color: THEME_WHITE,
        marginRight: 10,
        fontSize: 14
    },
    listItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: THEME_WHITE,
        marginHorizontal: 5
    },
    listElem: {
        color: THEME_WHITE,
        width: "100%",
        marginLeft: 8
    },
    disabled: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: THEME_WHITE,
        marginHorizontal: 5,
    },
    disabledText: {
        color: TEXT_DISABLED,
        width: "100%",
        marginLeft: 8

    },
    selected: {
        backgroundColor: THEME_BLUE_FOREGROUND_TRANSPARENT
    }
})

class FolderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            currentPath: RNFS.ExternalStorageDirectoryPath,
            selectFile: false,
            selectedArray: []
        };

    }

    getSelectedFiles = (array) => {
        let fileList = this.state.fileList?.filter((element, index) => array.includes(index));
        this.props.setSelectedFiles(fileList);
    }

    getDirList = async (path) => {
        if (path.split("/").slice(-1).pop() !== "emulated") {
            let list = []
            await RNFS.readDir(path)
                .then((result) => {
                    for (var i = 0; i < result.length; i++) {
                        // console.log(JSON.stringify(result[i].name) + "\n")
                        var tmp = result[i];
                        list.push(tmp)
                        // if (result[i].name.endsWith('.txt')) {
                        // console.warn(tmp); // debug
                        // items.push(tmp);
                        // }

                    }
                    // console.warn(items); // empty
                })
                .catch((err) => {
                    console.log(err.message, err.code);
                });
            // console.log("list", list)
            this.setState({ fileList: list, currentPath: path })
        } else { }
    }


    componentDidMount = async () => {
        this.getDirList(RNFS.ExternalStorageDirectoryPath);
    }

    // handleCanvas = (canvas) => {
    //     this.state.wave.fromFile("/storage/emulated/0/Download/Twenty one pilots - car radio.mp3", { type: "shockwave", colors: ["red", "white"] })
    // }

    render() {
        return (
            <View style={styles.fileListContainer}>

                <View style={styles.currentPathLabelContainer}>
                    <SimpleIcon.Button
                        name="action-undo"
                        backgroundColor={"transparent"}
                        size={20}
                        color={this.state.selectFile ? TEXT_DISABLED : THEME_WHITE}
                        style={styles.backButton}
                        onPress={(() => {
                            this.getDirList(this.state.currentPath?.split("/").slice(0, -1).join("/"))
                        })}
                        disabled={this.state.selectFile}
                    />
                    <Text numberOfLines={1} ellipsizeMode="head" style={styles.currentPathLabel}>{this.state.currentPath}</Text>
                    {this.state.selectFile && <View>
                        <Text style={styles.selectedFileCount}>Selected: {this.state.selectedArray.length}</Text>

                    </View>
                    }
                </View>

                {!!this.state.fileList &&
                    <FlatList
                        style={{ width: "100%" }}
                        keyExtractor={(item, index) => `${item?.mtime}-${item?.name}-${index}`}
                        data={this.state.fileList}
                        renderItem={({ item, index, separators }) => {
                            if (item.isDirectory() || (item.isFile() && (item.name.endsWith(".mp3") || item.name.endsWith(".amr")) || item.name.endsWith(".ogg") || item.name.endsWith(".flv") || item.name.endsWith(".mp4"))) {
                                return <TouchableNativeFeedback
                                    onPress={() => {
                                        if (item.isDirectory()) {
                                            if (this.state.selectFile) {
                                                // console.log("This is a file");
                                            } else {
                                                this.getDirList(item.path)
                                            }
                                        } else if (item.isFile() && (item.name.endsWith(".mp3") || item.name.endsWith(".amr") || item.name.endsWith(".ogg") || item.name.endsWith(".flv") || item.name.endsWith(".mp4"))) {
                                            if (this.state.selectFile) {
                                                let array = this.state.selectedArray;
                                                if (array.includes(index)) {
                                                    array.splice(array.indexOf(index), 1);
                                                } else {
                                                    array.push(index);
                                                }
                                                console.log("array", array)
                                                if (array.length > 0) {
                                                    this.getSelectedFiles(array);
                                                    this.setState({
                                                        selectedArray: array
                                                    })
                                                } else if (array.length === 0) {
                                                    this.getSelectedFiles(array);
                                                    this.props.setMenuItemList()
                                                    this.setState({
                                                        selectedArray: array,
                                                        selectFile: false
                                                    })
                                                }
                                            } else {
                                                let track = {
                                                    url: item.path,
                                                    title: item.name
                                                }
                                                playTrackWithPath(track);
                                            }
                                        }
                                    }}
                                    onLongPress={() => {
                                        if (item.isFile() && !this.state.selectFile) {
                                            let array = [...this.state.selectedArray, index]
                                            this.props.setMenuItemList([ADD_TO_PLAYLIST_MENU_ITEM]);
                                            this.getSelectedFiles(array);
                                            this.setState({
                                                selectFile: true,
                                                selectedArray: array
                                            })
                                        }
                                    }}
                                    disabled={this.state.selectFile && item.isDirectory()}
                                    background={TouchableNativeFeedback.Ripple(THEME_BLUE_FOREGROUND, false)}
                                >
                                    <View style={this.state.selectFile && item.isDirectory() ? styles.disabled : this.state.selectedArray.includes(index) ? [styles.selected, styles.listItemContainer] : styles.listItemContainer}>
                                        {/* {this.state.selectFile && <CheckBox  
                                        />} */}
                                        <SimpleIcon name={`${item.isDirectory() ? "folder" : "music-tone-alt"}`} size={20} color={this.state.selectFile && item.isDirectory() ? TEXT_DISABLED : THEME_WHITE} />
                                        <Text style={this.state.selectFile && item.isDirectory() ? styles.disabledText : styles.listElem}>{item.name}</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            }
                        }}
                    />}

            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {}
}
const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedFiles: (files) => dispatch(setSelectedFiles(files))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FolderList);