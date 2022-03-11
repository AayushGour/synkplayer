import React, { Component } from 'react';
import { Button, DeviceEventEmitter, FlatList, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import * as RNFS from 'react-native-fs';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import { THEME_BLUE_FOREGROUND, THEME_WHITE } from '../../../Constants';
import CheckBox from '@react-native-community/checkbox';

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
    }
})

class FolderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            currentPath: RNFS.ExternalStorageDirectoryPath,
            selectFile: false
        };

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
                        color="#fff"
                        style={styles.backButton}
                        onPress={(() => {
                            this.getDirList(this.state.currentPath?.split("/").slice(0, -1).join("/"))
                        })}
                    />
                    <Text numberOfLines={1} ellipsizeMode="head" style={styles.currentPathLabel}>{this.state.currentPath}</Text>
                </View>
                {!!this.state.fileList &&
                    <FlatList
                        style={{ width: "100%" }}
                        keyExtractor={(item, index) => `${item?.mtime}-${item?.name}-${index}`}
                        data={this.state.fileList}
                        renderItem={({ item, index, separators }) => {
                            if (item.isDirectory() || (item.isFile() && item.name.endsWith(".mp3"))) {
                                return <TouchableNativeFeedback
                                    onPress={() => {
                                        if (item.isDirectory()) {
                                            this.getDirList(item.path)
                                        } else if (item.isFile() && item.name.endsWith(".mp3")) {
                                            console.log(item.path)
                                        }
                                    }}
                                    onLongPress={() => {
                                        this.setState({
                                            selectFile: true
                                        })
                                    }}
                                    background={TouchableNativeFeedback.Ripple(THEME_BLUE_FOREGROUND, false)}
                                >
                                    <View style={styles.listItemContainer}>
                                        {/* {this.state.selectFile && <CheckBox  
                                        />} */}
                                        <SimpleIcon name={`${item.isDirectory() ? "folder" : "music-tone-alt"}`} size={20} color="#fff" />
                                        <Text style={styles.listElem}>{item.name}</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            }
                        }}
                    />}

            </View>
        );
    }
}

export default FolderList;